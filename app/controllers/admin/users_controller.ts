import type { HttpContext } from '@adonisjs/core/http'
import Entreprise from '#models/entreprise'
import Commande from '#models/commande'
import Historique from '#models/historique'

export default class UsersController {
  async index({ view }: HttpContext) {
    return view.render('admin/users/index')
  }

  async create({ view }: HttpContext) {
    return view.render('admin/users/form')
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
      contactsGeres: Number(contactsGeres[0].$extras.total),
      commandesTraitees: Number(commandesTraitees[0].$extras.total),
      commandesReussies: Number(commandesReussies[0].$extras.total),
    },
    historique,
  })
   }
}





