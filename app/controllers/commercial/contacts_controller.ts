import type { HttpContext } from '@adonisjs/core/http'
import Entreprise from '#models/entreprise'
import Commande from '#models/commande'
import CommandeProduit from '#models/commande_produit'
import Produit from '#models/produit'
import { DateTime } from 'luxon'
import User from '#models/user'
import TransfertProspect from '#models/transfert_prospect'

export default class ContactsController {
  async index({ view, auth }: HttpContext) {
    const commercialId = auth.user!.id

    const contacts = await Entreprise.query()
      .where('commercial_id', commercialId)
      .orderBy('updated_at', 'desc')

    const prospects = contacts.filter((c) => c.statut === 'prospect').length
    const clients = contacts.filter((c) => c.statut === 'client').length
    const total = contacts.length

    return view.render('commercial/contacts/index', {
      contacts,
      stats: { prospects, clients, total },
    })
  }

  async create({ view }: HttpContext) {
    const produits = await Produit.query().where('statut', 'actif')
    return view.render('commercial/contacts/create', { produits })
  }

  async store({ request, auth, response, session }: HttpContext) {
  const commercialId = auth.user!.id
  const data = request.only([
    'type', 'nom', 'secteurActivite', 'adresse', 'telephone', 'email',
    'produitInteretId', 'quantiteInteret',
    'wantsNewCommande', 'newProduitId', 'newQuantite',
  ])

  const pastProduitId = request.input('pastProduitId', [])
  const pastQuantite = request.input('pastQuantite', [])
  const pastDate = request.input('pastDate', [])
  const pastStatut = request.input('pastStatut', [])

  const isClient = data.type === 'client'

  const entreprise = await Entreprise.create({
    nom: data.nom,
    secteurActivite: data.secteurActivite || null,
    adresse: data.adresse || null,
    telephone: data.telephone || null,
    email: data.email || null,
    statut: isClient ? 'client' : 'prospect',
    commercialId,
  })

  if (!isClient) {
    const commande = await Commande.create({
      entrepriseId: entreprise.id,
      commercialId,
      statut: 'en_cours',
      dateCommande: DateTime.now(),
    })
    if (data.produitInteretId) {
      await CommandeProduit.create({
        commandeId: commande.id,
        produitId: Number(data.produitInteretId),
        quantite: Number(data.quantiteInteret) || 1,
      })
    }
  } else {
    // Boucle sur toutes les commandes passées ajoutées dynamiquement
    for (let i = 0; i < pastProduitId.length; i++) {
      if (!pastProduitId[i]) continue

      const pastCommande = await Commande.create({
        entrepriseId: entreprise.id,
        commercialId,
        statut: pastStatut[i] === 'terminee' ? 'terminee' : 'validee',
        dateCommande: pastDate[i] ? DateTime.fromISO(pastDate[i]) : DateTime.now(),
        dateValidation: DateTime.now(),
      })
      await CommandeProduit.create({
        commandeId: pastCommande.id,
        produitId: Number(pastProduitId[i]),
        quantite: Number(pastQuantite[i]) || 1,
      })
    }

    if (data.wantsNewCommande === 'on' && data.newProduitId) {
      const newCommande = await Commande.create({
        entrepriseId: entreprise.id,
        commercialId,
        statut: 'en_cours',
        dateCommande: DateTime.now(),
      })
      await CommandeProduit.create({
        commandeId: newCommande.id,
        produitId: Number(data.newProduitId),
        quantite: Number(data.newQuantite) || 1,
      })
    }
  }

  session.flash('success', 'Contact créé avec succès.')
  return response.redirect('/commercial/contacts')
}

  async edit({ view, params }: HttpContext) {
    const contact = await Entreprise.findOrFail(params.id)
    return view.render('commercial/contacts/edit', { contact })
  }

  async update({ request, params, response, session }: HttpContext) {
    const contact = await Entreprise.findOrFail(params.id)
    const data = request.only(['nom', 'secteurActivite', 'adresse', 'telephone', 'email', 'statut'])
    contact.merge(data)
    await contact.save()

    session.flash('success', 'Contact mis à jour.')
    return response.redirect('/commercial/contacts')
  }

  async destroy({ params, response, session }: HttpContext) {
    const contact = await Entreprise.findOrFail(params.id)
    await contact.delete()

    session.flash('success', 'Contact supprimé.')
    return response.redirect('/commercial/contacts')
  }

  async show({ view, params, auth }: HttpContext) {
  const contact = await Entreprise.query().where('id', params.id).preload('commandes').firstOrFail()
  const commerciaux = await User.query()
    .where('role', 'commercial')
    .whereNot('id', auth.user!.id)

  return view.render('commercial/contacts/show', { contact, commerciaux })
}

async transfer({ request, params, auth, response, session }: HttpContext) {
  const contact = await Entreprise.findOrFail(params.id)
  const nouveauCommercialId = Number(request.input('nouveauCommercialId'))
  const motif = request.input('motif') || null

  await TransfertProspect.create({
    entrepriseId: contact.id,
    ancienCommercialId: auth.user!.id,
    nouveauCommercialId,
    motif,
  })

  contact.commercialId = nouveauCommercialId
  await contact.save()

  session.flash('success', 'Contact transféré avec succès.')
  return response.redirect('/commercial/contacts')
}

  
}



/**import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ContactsController {
  async index({ view, auth }: HttpContext) {
    const contacts = await db
      .from('entreprises')
      .leftJoin('commandes', (query) => {
        query.on('commandes.entreprise_id', '=', 'entreprises.id')
      })
      .where('entreprises.commercial_id', auth.user!.id)
      .orderBy('commandes.created_at', 'desc')
      .select(
        'entreprises.id',
        'entreprises.nom',
        'entreprises.secteur_activite',
        'entreprises.email',
        'entreprises.telephone',
        'entreprises.statut',
        'commandes.statut as commande_statut',
        'commandes.date_commande'
      )

    // Garder uniquement la commande la plus récente par entreprise
    const seen = new Set()
    const contactsUniques = contacts.filter((c) => {
      if (seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })

    const contactsFormates = contactsUniques.map((c) => ({
      id: c.id,
      nom: c.nom,
      secteur: c.secteur_activite,
      email: c.email,
      telephone: c.telephone,
      statutClient: c.statut, // 'prospect' ou 'client'
      actif: c.commande_statut === 'en_cours',
      initiales: c.nom.split(' ').map((m: string) => m[0]).slice(0, 2).join('').toUpperCase(),
    }))

    return view.render('commercial/contacts/index', { contacts: contactsFormates })
  }

  async show({ params, view, auth }: HttpContext) {
    const entreprise = await db
      .from('entreprises')
      .where('id', params.id)
      .andWhere('commercial_id', auth.user!.id)
      .first()

    const commandes = await db
      .from('commandes')
      .where('entreprise_id', params.id)
      .orderBy('date_commande', 'desc')

    const historiques = await db
      .from('historiques')
      .where('entreprise_id', params.id)
      .orderBy('date_action', 'desc')

    return view.render('commercial/contacts/show', { entreprise, commandes, historiques })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { nom, secteur_activite, email, telephone, adresse } = request.only([
      'nom', 'secteur_activite', 'email', 'telephone', 'adresse',
    ])

    const trx = await db.transaction()
    try {
      const [entreprise] = await trx
        .table('entreprises')
        .insert({
          nom,
          secteur_activite,
          email,
          telephone,
          adresse,
          statut: 'prospect',
          commercial_id: auth.user!.id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning('id')

      const entrepriseId = (entreprise as any).id ?? entreprise

      await trx.table('commandes').insert({
        entreprise_id: entrepriseId,
        commercial_id: auth.user!.id,
        statut: 'en_cours',
        date_commande: new Date().toISOString().slice(0, 10),
        created_at: new Date(),
        updated_at: new Date(),
      })

      await trx.table('historiques').insert({
        entreprise_id: entrepriseId,
        commercial_id: auth.user!.id,
        type_action: 'creation_prospect',
        description: 'Nouveau prospect ajouté',
        date_action: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })

      await trx.commit()
      session.flash('success', 'Contact ajouté avec succès')
      return response.redirect('/commercial/contacts')
    } catch (error) {
      await trx.rollback()
      session.flash('error', "Erreur lors de l'ajout du contact")
      return response.redirect().back()
    }
  }

  async destroy({ params, response, auth, session }: HttpContext) {
    await db
      .from('entreprises')
      .where('id', params.id)
      .andWhere('commercial_id', auth.user!.id)
      .delete()

    session.flash('success', 'Contact supprimé')
    return response.redirect('/commercial/contacts')
  }
}**/





