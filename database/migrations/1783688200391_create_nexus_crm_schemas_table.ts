import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'nexus_crm_schemas'

  async up() {
    // 1. Ajout des champs métier à la table users existante
    this.schema.alterTable('users', (table) => {
      table.enum('role', ['admin', 'commercial']).notNullable().defaultTo('commercial')
      table.enum('statut_compte', ['actif', 'inactif']).notNullable().defaultTo('actif')
    })

    // 2. Entreprises (prospects et clients)
    this.schema.createTable('entreprises', (table) => {
      table.increments('id')
      table.string('nom', 150).notNullable()
      table.string('secteur_activite', 100).nullable()
      table.string('adresse', 255).nullable()
      table.string('telephone', 20).nullable()
      table.string('email', 150).nullable()
      table.enum('statut', ['prospect', 'client']).notNullable().defaultTo('prospect')
      table.integer('commercial_id').unsigned().nullable()
        .references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // 3. Produits / services
    this.schema.createTable('produits', (table) => {
      table.increments('id')
      table.string('nom', 150).notNullable()
      table.text('description').nullable()
      table.decimal('prix', 10, 2).notNullable()
      table.enum('type', ['produit', 'service']).notNullable().defaultTo('produit')
      table.enum('statut', ['actif', 'inactif']).notNullable().defaultTo('actif')
      table.integer('cree_par').unsigned().nullable()
        .references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // 4. Commandes (le "prospect en traitement")
    this.schema.createTable('commandes', (table) => {
      table.increments('id')
      table.integer('entreprise_id').unsigned().notNullable()
        .references('id').inTable('entreprises').onDelete('CASCADE')
      table.integer('commercial_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('RESTRICT')
      table.enum('statut', ['en_cours', 'validee', 'terminee', 'annulee']).notNullable().defaultTo('en_cours')
      table.date('date_commande').notNullable()
      table.date('date_validation').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // 5. Table pivot commande <-> produit
    this.schema.createTable('commande_produits', (table) => {
      table.increments('id')
      table.integer('commande_id').unsigned().notNullable()
        .references('id').inTable('commandes').onDelete('CASCADE')
      table.integer('produit_id').unsigned().notNullable()
        .references('id').inTable('produits').onDelete('RESTRICT')
      table.integer('quantite').unsigned().notNullable().defaultTo(1)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['commande_id', 'produit_id'])
    })

    // 6. Historique des interactions
    this.schema.createTable('historiques', (table) => {
      table.increments('id')
      table.integer('entreprise_id').unsigned().notNullable()
        .references('id').inTable('entreprises').onDelete('CASCADE')
      table.integer('commercial_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('RESTRICT')
      table.integer('commande_id').unsigned().nullable()
        .references('id').inTable('commandes').onDelete('SET NULL')
      table.enum('type_action', ['creation_prospect', 'echange', 'commande', 'transfert', 'validation']).notNullable()
      table.text('description').nullable()
      table.timestamp('date_action').notNullable().defaultTo(this.now())
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // 7. Transferts de prospects entre commerciaux
    this.schema.createTable('transferts_prospects', (table) => {
      table.increments('id')
      table.integer('entreprise_id').unsigned().notNullable()
        .references('id').inTable('entreprises').onDelete('CASCADE')
      table.integer('ancien_commercial_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('RESTRICT')
      table.integer('nouveau_commercial_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('RESTRICT')
      table.string('motif', 255).nullable()
      table.timestamp('date_transfert').notNullable().defaultTo(this.now())
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable('transferts_prospects')
    this.schema.dropTable('historiques')
    this.schema.dropTable('commande_produits')
    this.schema.dropTable('commandes')
    this.schema.dropTable('produits')
    this.schema.dropTable('entreprises')
    this.schema.alterTable('users', (table) => {
      table.dropColumn('role')
      table.dropColumn('statut_compte')
    })
  }
}
