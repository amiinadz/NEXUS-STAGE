import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      if (user.role === 'admin') {
        return response.redirect('/admin/dashboard')
      }
      return response.redirect('/commercial/dashboard')
    } catch {
      session.flash('error', 'Email ou mot de passe incorrect')
      return response.redirect().back()
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}