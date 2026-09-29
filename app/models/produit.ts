import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Produit extends BaseModel {
  static table = 'produits'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @column()
  declare description: string | null

  @column()
  declare prix: number

  @column()
  declare type: 'produit' | 'service'

  @column()
  declare statut: 'actif' | 'inactif'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare creePar: number | null
}