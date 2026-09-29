import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Entreprise from '#models/entreprise'
import User from '#models/user'
import Commande from '#models/commande'

export default class Historique extends BaseModel {
  static table = 'historiques'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare entrepriseId: number

  @column()
  declare commercialId: number

  @column()
  declare commandeId: number | null

  @column()
  declare typeAction: 'creation_prospect' | 'echange' | 'commande' | 'transfert' | 'validation'

  @column()
  declare description: string | null

  @column.dateTime()
  declare dateAction: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Entreprise, { foreignKey: 'entrepriseId' })
  declare entreprise: BelongsTo<typeof Entreprise>

  @belongsTo(() => User, { foreignKey: 'commercialId' })
  declare commercial: BelongsTo<typeof User>

  @belongsTo(() => Commande, { foreignKey: 'commandeId' })
  declare commande: BelongsTo<typeof Commande>
}