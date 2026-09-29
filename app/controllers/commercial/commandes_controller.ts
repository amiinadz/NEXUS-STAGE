import type { HttpContext } from '@adonisjs/core/http'
import Commande from '#models/commande'
import Entreprise from '#models/entreprise'
import Produit from '#models/produit'
import CommandeProduit from '#models/commande_produit'
import { DateTime } from 'luxon'

export default class CommandesController {
  async index({ view, auth }: HttpContext) {
    const commercialId = auth.user!.id

    const commandes = await Commande.query()
      .where('commercial_id', commercialId)
      .preload('entreprise')
      .preload('produits', (q) => q.preload('produit'))
      .orderBy('date_commande', 'desc')

    const enCours = commandes.filter((c) => c.statut === 'en_cours').length
    const validees = commandes.filter((c) => c.statut === 'validee').length
    const terminees = commandes.filter((c) => c.statut === 'terminee').length
    const total = commandes.length

    return view.render('commercial/commandes/index', {
      commandes,
      stats: { enCours, validees, terminees, total },
    })
  }

  async create({ view, auth }: HttpContext) {
    const commercialId = auth.user!.id
    const entreprises = await Entreprise.query().where('commercial_id', commercialId)
    const produits = await Produit.query().where('statut', 'actif')
    return view.render('commercial/commandes/create', { entreprises, produits })
  }

  async store({ request, auth, response, session }: HttpContext) {
    const commercialId = auth.user!.id
    const data = request.only(['entrepriseId', 'produitId', 'quantite', 'dateCommande', 'statut'])

    const commande = await Commande.create({
      entrepriseId: Number(data.entrepriseId),
      commercialId,
      statut: (data.statut as any) || 'en_cours',
      dateCommande: data.dateCommande ? DateTime.fromISO(data.dateCommande) : DateTime.now(),
    })

    if (data.produitId) {
      await CommandeProduit.create({
        commandeId: commande.id,
        produitId: Number(data.produitId),
        quantite: Number(data.quantite) || 1,
      })
    }

    session.flash('success', 'Commande créée avec succès.')
    return response.redirect('/commercial/commandes')
  }

  async show({ view, params }: HttpContext) {
    const commande = await Commande.query()
      .where('id', params.id)
      .preload('entreprise')
      .preload('produits', (q) => q.preload('produit'))
      .firstOrFail()

    return view.render('commercial/commandes/show', { commande })
  }

  async destroy({ params, response, session }: HttpContext) {
    const commande = await Commande.findOrFail(params.id)
    await commande.delete()
    session.flash('success', 'Commande supprimée.')
    return response.redirect('/commercial/commandes')
  }
}