import type { HttpContext } from '@adonisjs/core/http'
import Historique from '#models/historique'
import Entreprise from '#models/entreprise'
import { DateTime } from 'luxon'

const HOUR_HEIGHT = 60 // hauteur en px d'une heure dans le calendrier
const START_HOUR = 8
const END_HOUR = 18

export default class EchangesController {
  async index({ view, auth, request }: HttpContext) {
    const commercialId = auth.user!.id

    const semaineParam = request.input('semaine')
    const refDate = semaineParam ? DateTime.fromISO(semaineParam) : DateTime.now()
    const lundi = refDate.startOf('week')
    const dimanche = lundi.plus({ days: 6 }).endOf('day')

    const echanges = await Historique.query()
      .where('commercial_id', commercialId)
      .preload('entreprise')
      .orderBy('date_action', 'asc')

    const echangesSemaine = echanges.filter(
      (e) => e.dateAction >= lundi && e.dateAction <= dimanche
    )

    const jours = Array.from({ length: 7 }, (_, i) => {
      const jour = lundi.plus({ days: i })
      const evenements = echangesSemaine
        .filter((e) => e.dateAction.hasSame(jour, 'day'))
        .map((e) => {
          const heureDecimale = e.dateAction.hour + e.dateAction.minute / 60
          const topPx = Math.max(0, (heureDecimale - START_HOUR) * HOUR_HEIGHT)
          return {
            id: e.id,
            heure: e.dateAction.toFormat('HH:mm'),
            entreprise: e.entreprise.nom,
            type: e.typeAction,
            description: e.description,
            topPx,
          }
        })
      return { date: jour, evenements, estAujourdhui: jour.hasSame(DateTime.now(), 'day') }
    })

    const heures = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)

    const total = echanges.length
    const echangesSimples = echanges.filter((e) => e.typeAction === 'echange').length
    const validations = echanges.filter((e) => e.typeAction === 'validation').length
    const transferts = echanges.filter((e) => e.typeAction === 'transfert').length

    return view.render('commercial/echanges/index', {
      echanges,
      jours,
      heures,
      lundi,
      dimanche,
      hourHeight: HOUR_HEIGHT,
      gridHeight: heures.length * HOUR_HEIGHT,
      stats: { total, echangesSimples, validations, transferts },
    })
  }

  async create({ view, auth }: HttpContext) {
    const commercialId = auth.user!.id
    const entreprises = await Entreprise.query().where('commercial_id', commercialId)
    return view.render('commercial/echanges/create', { entreprises })
  }

  async store({ request, auth, response, session }: HttpContext) {
    const commercialId = auth.user!.id
    const data = request.only(['entrepriseId', 'typeAction', 'description', 'dateAction'])

    await Historique.create({
      entrepriseId: Number(data.entrepriseId),
      commercialId,
      typeAction: data.typeAction as any,
      description: data.description || null,
      dateAction: data.dateAction ? DateTime.fromISO(data.dateAction) : DateTime.now(),
    })

    session.flash('success', 'Échange enregistré avec succès.')
    return response.redirect('/commercial/echanges')
  }
}