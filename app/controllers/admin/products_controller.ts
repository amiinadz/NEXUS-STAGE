import type { HttpContext } from '@adonisjs/core/http'
import Produit from '#models/produit'

export default class ProductsController {
  async index({ view }: HttpContext) {
    const produits = await Produit.query().orderBy('created_at', 'desc')

    const total = produits.length
    const actifs = produits.filter((p) => p.statut === 'actif').length
    const services = produits.filter((p) => p.type === 'service').length
    const produitsPhysiques = produits.filter((p) => p.type === 'produit').length

    return view.render('admin/products/index', {
      produits,
      stats: { total, actifs, services, produitsPhysiques },
    })
  }

  async create({ view }: HttpContext) {
    return view.render('admin/products/create')
  }

  async store({ request, response, session }: HttpContext) {
    const data = request.only(['nom', 'description', 'prix', 'type'])

    await Produit.create({
      nom: data.nom,
      description: data.description || null,
      prix: Number(data.prix),
      type: data.type as any,
      statut: 'actif',
    })

    session.flash('success', 'Produit créé avec succès.')
    return response.redirect('/admin/produits')
  }

  async edit({ view, params }: HttpContext) {
    const produit = await Produit.findOrFail(params.id)
    return view.render('admin/products/edit', { produit })
  }

  async update({ request, params, response, session }: HttpContext) {
    const produit = await Produit.findOrFail(params.id)
    const data = request.only(['nom', 'description', 'prix', 'type', 'statut'])

    produit.nom = data.nom
    produit.description = data.description || null
    produit.prix = Number(data.prix)
    produit.type = data.type
    produit.statut = data.statut
    await produit.save()

    session.flash('success', 'Produit mis à jour.')
    return response.redirect('/admin/produits')
  }

  async destroy({ params, response, session }: HttpContext) {
    const produit = await Produit.findOrFail(params.id)
    await produit.delete()
    session.flash('success', 'Produit supprimé.')
    return response.redirect('/admin/produits')
  }
}