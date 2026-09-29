import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Produit from '#models/produit'

export default class CommandeProduit extends BaseModel {
  static table = 'commande_produits'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare commandeId: number

  @column()
  declare produitId: number

  @column()
  declare quantite: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  
  @belongsTo(() => Produit, { foreignKey: 'produitId' })
declare produit: BelongsTo<typeof Produit>
}