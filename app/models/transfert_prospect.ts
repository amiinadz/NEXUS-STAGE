import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TransfertProspect extends BaseModel {
  static table = 'transferts_prospects'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare entrepriseId: number

  @column()
  declare ancienCommercialId: number

  @column()
  declare nouveauCommercialId: number

  @column()
  declare motif: string | null

  @column.dateTime({ autoCreate: true })
  declare dateTransfert: DateTime
}