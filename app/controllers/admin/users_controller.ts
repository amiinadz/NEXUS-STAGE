import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Entreprise from '#models/entreprise'
import Commande from '#models/commande'
import Historique from '#models/historique'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async index({ view, request }: HttpContext) {
    const search = (request.input('search') || '').trim()
    const role = request.input('role', 'all')
    const statut = request.input('statut', 'all')

    const query = User.query()

    if (search) {
      query.where((q) => {
        q.whereILike('full_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
      })
    }

    if (role && role !== 'all') {
      query.where('role', role)
    }

    if (statut && statut !== 'all') {
      query.where('statut_compte', statut)
    }

    const users = await query.orderBy('created_at', 'desc')

    // Attach stats per user (contacts and orders counts for commercial)
    for (const u of users) {
      if (u.role === 'commercial') {
        const cCount = await Entreprise.query().where('commercial_id', u.id).count('* as total')
        const cmdCount = await Commande.query().where('commercial_id', u.id).count('* as total')
        ;(u as any).contactsCount = Number(cCount[0]?.$extras?.total || 0)
        ;(u as any).commandesCount = Number(cmdCount[0]?.$extras?.total || 0)
      } else {
        ;(u as any).contactsCount = null
        ;(u as any).commandesCount = null
      }
    }

    // Overall global stats
    const allUsers = await User.query()
    const total = allUsers.length
    const actifs = allUsers.filter((u) => u.statutCompte === 'actif').length
    const inactifs = allUsers.filter((u) => u.statutCompte === 'inactif').length
    const commerciaux = allUsers.filter((u) => u.role === 'commercial').length
    const admins = allUsers.filter((u) => u.role === 'admin').length

    return view.render('admin/users/index', {
      users,
      stats: {
        total,
        actifs,
        inactifs,
        commerciaux,
        admins,
      },
      filters: {
        search,
        role,
        statut,
      },
    })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/users/create')
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password', 'role', 'statutCompte'])

    const existing = await User.findBy('email', data.email)
    if (existing) {
      session.flash('error', 'Un compte avec cet email existe déjà.')
      return response.redirect().back()
    }

    await User.create({
      fullName: data.fullName,
      email: data.email,
      password: await hash.make(data.password || 'password123'),
      role: data.role || 'commercial',
      statutCompte: data.statutCompte || 'actif',
    })

    session.flash('success', 'Utilisateur créé avec succès.')
    return response.redirect('/admin/utilisateurs')
  }

  async show({ view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const contactsGeres = await Entreprise.query().where('commercial_id', user.id).count('* as total')
    const commandesTraitees = await Commande.query().where('commercial_id', user.id).count('* as total')
    const commandesReussies = await Commande.query()
      .where('commercial_id', user.id)
      .whereIn('statut', ['validee', 'terminee'])
      .count('* as total')

    const historique = await Historique.query()
      .where('commercial_id', user.id)
      .preload('entreprise')
      .orderBy('date_action', 'desc')
      .limit(20)

    return view.render('admin/users/show', {
      user,
      stats: {
        contactsGeres: Number(contactsGeres[0]?.$extras?.total || 0),
        commandesTraitees: Number(commandesTraitees[0]?.$extras?.total || 0),
        commandesReussies: Number(commandesReussies[0]?.$extras?.total || 0),
      },
      historique,
    })
  }

  async edit({ view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('admin/users/edit', { user })
  }

  async update({ request, params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['fullName', 'email', 'password', 'role', 'statutCompte'])

    user.fullName = data.fullName
    user.email = data.email
    user.role = data.role
    user.statutCompte = data.statutCompte

    if (data.password && data.password.trim().length > 0) {
      user.password = await hash.make(data.password.trim())
    }

    await user.save()

    session.flash('success', 'Utilisateur mis à jour avec succès.')
    return response.redirect('/admin/utilisateurs')
  }

  async toggleStatut({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (auth.user?.id === user.id) {
      session.flash('error', 'Vous ne pouvez pas désactiver votre propre compte.')
      return response.redirect().back()
    }

    user.statutCompte = user.statutCompte === 'actif' ? 'inactif' : 'actif'
    await user.save()

    session.flash('success', `Statut du compte de ${user.fullName} mis à jour : ${user.statutCompte}.`)
    return response.redirect().back()
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (auth.user?.id === user.id) {
      session.flash('error', 'Vous ne pouvez pas supprimer votre propre compte.')
      return response.redirect().back()
    }

    await user.delete()

    session.flash('success', 'Utilisateur supprimé avec succès.')
    return response.redirect('/admin/utilisateurs')
  }
}
