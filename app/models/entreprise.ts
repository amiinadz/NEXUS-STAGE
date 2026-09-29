/**import { EntrepriseSchema } from '#database/schema'

export default class Entreprise extends EntrepriseSchema {
}**/

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Commande from '#models/commande'

export default class Entreprise extends BaseModel {
  static table = 'entreprises'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @column()
  declare secteurActivite: string | null

  @column()
  declare adresse: string | null

  @column()
  declare telephone: string | null

  @column()
  declare email: string | null

  @column()
  declare statut: 'prospect' | 'client'

  @column()
  declare commercialId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'commercialId' })
  declare commercial: BelongsTo<typeof User>

  @hasMany(() => Commande, { foreignKey: 'entrepriseId' })
  declare commandes: HasMany<typeof Commande>
}