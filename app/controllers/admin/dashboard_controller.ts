import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Entreprise from '#models/entreprise'
import Commande from '#models/commande'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  async index({ view }: HttpContext) {
    const now = DateTime.now()
    const startMonth = now.startOf('month')

    const users = await User.query()
    const utilisateursActifs = users.filter((u) => u.statutCompte === 'actif').length
    const nouveauxUtilisateurs = users.filter((u) => u.createdAt >= startMonth).length
    const comptesInactifs = users.filter((u) => u.statutCompte === 'inactif').length
    const nbAdmins = users.filter((u) => u.role === 'admin').length
    const nbCommerciaux = users.filter((u) => u.role === 'commercial').length

    const commandesRecues = await Commande.query().count('* as total')
    const prospectsApp = await Entreprise.query().where('statut', 'prospect').count('* as total')

    // Répartition des utilisateurs par rôle (donut)
    const totalUsers = users.length || 1
    const repartitionRoles = [
      { label: 'Administrateur', count: nbAdmins, value: Math.round((nbAdmins / totalUsers) * 100), color: '#7c6fd6' },
      { label: 'Commercial', count: nbCommerciaux, value: Math.round((nbCommerciaux / totalUsers) * 100), color: '#4fb894' },
    ]

    // Évolution des commandes réussies (par semaine, ce mois)
    const commandesReussies = await Commande.query()
      .whereIn('statut', ['validee', 'terminee'])
      .where('date_commande', '>=', startMonth.toISODate()!)
      .orderBy('date_commande', 'asc')

    const semaines: { label: string; count: number }[] = []
    for (let i = 0; i < 4; i++) {
      const debut = startMonth.plus({ weeks: i })
      const fin = startMonth.plus({ weeks: i + 1 })
      const nb = commandesReussies.filter((c) => c.dateCommande >= debut && c.dateCommande < fin).length
      semaines.push({ label: debut.toFormat('dd/MM'), count: nb })
    }

    // Meilleurs commerciaux (par nb commandes réussies + montant total)
    const meilleursCommerciaux = await db
    .from('commandes as c')
    .join('users as u', 'c.commercial_id', 'u.id')
    .leftJoin('commande_produits as cp', 'cp.commande_id', 'c.id')
    .leftJoin('produits as p', 'cp.produit_id', 'p.id')  
    .whereIn('c.statut', ['validee', 'terminee'])
    .select(
      'u.id',
      'u.full_name as nom',
      db.raw('COUNT(DISTINCT c.id) as "nbCommandes"'),
      db.raw('COALESCE(SUM(cp.quantite * p.prix), 0) as "montantTotal"')
    )
    .groupBy('u.id', 'u.full_name')
    .orderBy('nbCommandes', 'desc')
    .limit(5)

    // Produits les plus vendus
    const produitsVendus = await db
      .from('commande_produits as cp')
      .join('produits as p', 'cp.produit_id', 'p.id')
      .select('p.id', 'p.nom', 'p.prix')
      .sum('cp.quantite as qteTotale')
      .groupBy('p.id', 'p.nom', 'p.prix')
      .orderBy('qteTotale', 'desc')
      .limit(5)

    // Dernière activité (derniers utilisateurs créés/modifiés)
    const derniersUsers = await User.query().orderBy('updated_at', 'desc').limit(6)

    return view.render('admin/dashboard', {
      stats: {
        utilisateursActifs,
        nouveauxUtilisateurs,
        parRole: 2,
        comptesInactifs,
        commandesRecues: Number(commandesRecues[0].$extras.total),
        prospectsApp: Number(prospectsApp[0].$extras.total),
      },
      repartitionRoles,
      semaines,
      meilleursCommerciaux,
      produitsVendus,
      derniersUsers,
    })
  }
}