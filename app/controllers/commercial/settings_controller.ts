import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class SettingsController {
  async index({ view, auth }: HttpContext) {
    return view.render('commercial/settings', { user: auth.user })
  }

  async update({ request, auth, response, session }: HttpContext) {
    const user = auth.user!
    const data = request.only(['fullName', 'email', 'password'])

    user.fullName = data.fullName
    user.email = data.email
    if (data.password && data.password.trim() !== '') {
      user.password = data.password
    }
    await user.save()

    session.flash('success', 'Profil mis à jour avec succès.')
    return response.redirect('/commercial/parametres')
  }
}