import type { HttpContext } from '@adonisjs/core/http'
import Entreprise from '#models/entreprise'
import User from '#models/user'

export default class ClientsController {
  async index({ view, request }: HttpContext) {
    const search = (request.input('search') || '').trim()
    const statut = request.input('statut', 'all')
    const commercialId = request.input('commercialId', 'all')

    const query = Entreprise.query().preload('commercial').preload('commandes')

    if (search) {
      query.where((q) => {
        q.whereILike('nom', `%${search}%`)
          .orWhereILike('secteur_activite', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('telephone', `%${search}%`)
          .orWhereILike('adresse', `%${search}%`)
      })
    }

    if (statut && statut !== 'all') {
      query.where('statut', statut)
    }

    if (commercialId && commercialId !== 'all') {
      if (commercialId === 'unassigned') {
        query.whereNull('commercial_id')
      } else {
        query.where('commercial_id', commercialId)
      }
    }

    const clients = await query.orderBy('updated_at', 'desc')

    // Global stats across all entreprises
    const allEntreprises = await Entreprise.query()
    const totalClients = allEntreprises.filter((e) => e.statut === 'client').length
    const totalProspects = allEntreprises.filter((e) => e.statut === 'prospect').length
    const totalEntreprises = allEntreprises.length
    const totalAssignes = allEntreprises.filter((e) => e.commercialId !== null).length

    const commerciaux = await User.query()
      .where('role', 'commercial')
      .where('statut_compte', 'actif')
      .orderBy('full_name', 'asc')

    return view.render('admin/clients/index', {
      clients,
      stats: {
        totalClients,
        totalProspects,
        totalEntreprises,
        totalAssignes,
      },
      commerciaux,
      filters: {
        search,
        statut,
        commercialId,
      },
    })
  }

  async show({ view, params }: HttpContext) {
    const client = await Entreprise.query()
      .where('id', params.id)
      .preload('commercial')
      .preload('commandes', (cmdQuery) => {
        cmdQuery.preload('commercial').orderBy('date_commande', 'desc')
      })
      .firstOrFail()

    const commerciaux = await User.query()
      .where('role', 'commercial')
      .where('statut_compte', 'actif')
      .orderBy('full_name', 'asc')

    return view.render('admin/clients/show', {
      client,
      commerciaux,
    })
  }

  async create({ view }: HttpContext) {
    const commerciaux = await User.query()
      .where('role', 'commercial')
      .where('statut_compte', 'actif')
      .orderBy('full_name', 'asc')

    return view.render('admin/clients/create', { commerciaux })
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['nom', 'secteurActivite', 'adresse', 'telephone', 'email', 'statut', 'commercialId'])

    await Entreprise.create({
      nom: data.nom,
      secteurActivite: data.secteurActivite || null,
      adresse: data.adresse || null,
      telephone: data.telephone || null,
      email: data.email || null,
      statut: data.statut === 'client' ? 'client' : 'prospect',
      commercialId: data.commercialId ? Number(data.commercialId) : null,
    })

    session.flash('success', 'Client créé avec succès.')
    return response.redirect('/admin/clients')
  }

  async edit({ view, params }: HttpContext) {
    const client = await Entreprise.findOrFail(params.id)
    const commerciaux = await User.query()
      .where('role', 'commercial')
      .where('statut_compte', 'actif')
      .orderBy('full_name', 'asc')

    return view.render('admin/clients/edit', { client, commerciaux })
  }

  async update({ request, params, response, session }: HttpContext) {
    const client = await Entreprise.findOrFail(params.id)
    const data = request.only(['nom', 'secteurActivite', 'adresse', 'telephone', 'email', 'statut', 'commercialId'])

    client.merge({
      nom: data.nom,
      secteurActivite: data.secteurActivite || null,
      adresse: data.adresse || null,
      telephone: data.telephone || null,
      email: data.email || null,
      statut: data.statut === 'client' ? 'client' : 'prospect',
      commercialId: data.commercialId ? Number(data.commercialId) : null,
    })

    await client.save()

    session.flash('success', 'Informations du client mises à jour avec succès.')
    return response.redirect('/admin/clients')
  }

  async destroy({ params, response, session }: HttpContext) {
    const client = await Entreprise.findOrFail(params.id)
    await client.delete()

    session.flash('success', 'Client supprimé avec succès.')
    return response.redirect('/admin/clients')
  }

  async assign({ request, params, response, session }: HttpContext) {
    const client = await Entreprise.findOrFail(params.id)
    const commercialId = request.input('commercialId')

    client.commercialId = commercialId ? Number(commercialId) : null
    await client.save()

    session.flash('success', 'Commercial réassigné avec succès.')
    return response.redirect(`/admin/clients/${params.id}`)
  }
}