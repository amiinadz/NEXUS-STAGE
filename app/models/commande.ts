/**import { CommandeSchema } from '#database/schema'

export default class Commande extends CommandeSchema {
}**/

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Entreprise from '#models/entreprise'
import User from '#models/user'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import CommandeProduit from '#models/commande_produit'

export default class Commande extends BaseModel {
  static table = 'commandes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare entrepriseId: number

  @column()
  declare commercialId: number

  @column()
  declare statut: 'en_cours' | 'validee' | 'terminee' | 'annulee'

  @column.date()
  declare dateCommande: DateTime

  @column.date()
  declare dateValidation: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Entreprise, { foreignKey: 'entrepriseId' })
  declare entreprise: BelongsTo<typeof Entreprise>

  @belongsTo(() => User, { foreignKey: 'commercialId' })
  declare commercial: BelongsTo<typeof User>
  @hasMany(() => CommandeProduit, { foreignKey: 'commandeId' })
declare produits: HasMany<typeof CommandeProduit>
}
