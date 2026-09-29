import type { HttpContext } from '@adonisjs/core/http'
import Historique from '#models/historique'
import Commande from '#models/commande'
import Entreprise from '#models/entreprise'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  async index({ view, auth }: HttpContext) {
    const commercialId = auth.user!.id
    const now = DateTime.now()
    const startMonth = now.startOf('month')

    // Stats principales
    const echangesAVenir = await Historique.query()
      .where('commercial_id', commercialId)
      .where('date_action', '>=', now.toSQL()!)
      .where('date_action', '<', now.endOf('day').toSQL()!)
      .count('* as total')

    const commandesEnCours = await Commande.query()
      .where('commercial_id', commercialId)
      .where('statut', 'en_cours')
      .count('* as total')

    const totalEntreprises = await Entreprise.query().where('commercial_id', commercialId).count('* as total')
    const totalClients = await Entreprise.query()
      .where('commercial_id', commercialId)
      .where('statut', 'client')
      .count('* as total')

    const nbEntreprises = Number(totalEntreprises[0].$extras.total)
    const nbClients = Number(totalClients[0].$extras.total)
    const tauxConversion = nbEntreprises > 0 ? Math.round((nbClients / nbEntreprises) * 100) : 0

    const commandesValideesMois = await Commande.query()
      .where('commercial_id', commercialId)
      .whereIn('statut', ['validee', 'terminee'])
      .where('date_commande', '>=', startMonth.toISODate()!)
      .count('* as total')

    const objectifMensuel = Math.min(100, Math.round((Number(commandesValideesMois[0].$extras.total) / 10) * 100))

    // Prochains échanges (les 5 plus proches à venir)
    const prochainsEchanges = await Historique.query()
      .where('commercial_id', commercialId)
      .where('date_action', '>=', now.toSQL()!)
      .preload('entreprise')
      .orderBy('date_action', 'asc')
      .limit(5)

    // Clients ayant acheté le plus (par quantité totale)
    const clientsTop = await db
      .from('commande_produits as cp')
      .join('commandes as c', 'cp.commande_id', 'c.id')
      .join('entreprises as e', 'c.entreprise_id', 'e.id')
      .where('c.commercial_id', commercialId)
      .select('e.id', 'e.nom')
      .sum('cp.quantite as qte')
      .countDistinct('c.id as nbCommandes')
      .groupBy('e.id', 'e.nom')
      .orderBy('qte', 'desc')
      .limit(5)

    // Classement des meilleures commandes (par nombre de commandes, pour le donut)
    const classementCommandes = await Commande.query()
      .where('commercial_id', commercialId)
      .preload('entreprise')

    const groupes: Record<string, { nom: string; count: number }> = {}
    for (const c of classementCommandes) {
      const key = c.entreprise.nom
      if (!groupes[key]) groupes[key] = { nom: key, count: 0 }
      groupes[key].count++
    }
    const totalCmd = classementCommandes.length || 1
    const couleurs = ['#e8643f', '#7c6fd6', '#4fb894', '#d4a24e', '#3fa9ce']
    const classement = Object.values(groupes)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((g, i) => ({
        label: g.nom,
        count: g.count,
        pct: Math.round((g.count / totalCmd) * 100),
        color: couleurs[i % couleurs.length],
      }))

    // Évolution des prospects (nouveaux contacts par semaine, ce mois)
    const entreprisesMois = await Entreprise.query()
      .where('commercial_id', commercialId)
      .where('created_at', '>=', startMonth.toISODate()!)
      .orderBy('created_at', 'asc')

    const semaines: { label: string; count: number }[] = []
    let cumul = 0
    for (let i = 0; i < 4; i++) {
      const debut = startMonth.plus({ weeks: i })
      const fin = startMonth.plus({ weeks: i + 1 })
      const nb = entreprisesMois.filter((e) => e.createdAt >= debut && e.createdAt < fin).length
      cumul += nb
      semaines.push({ label: debut.toFormat('dd/MM'), count: cumul })
    }
    // Dernière activité
    const activites = await Historique.query()
      .where('commercial_id', commercialId)
      .preload('entreprise')
      .orderBy('created_at', 'desc')
      .limit(6)

    return view.render('commercial/dashboard', {
      stats: {
        echangesAVenir: Number(echangesAVenir[0].$extras.total),
        commandesEnCours: Number(commandesEnCours[0].$extras.total),
        tauxConversion,
        objectifMensuel,
      },
      prochainsEchanges,
      clientsTop,
      classement,
      semaines,
      activites,
    })
  }
}