import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    // ---------- 1. USERS (1 admin + 5 commerciaux) ----------
    const userRows = await db.table('users').multiInsert([
      { full_name: 'Amina Ferhat', email: 'amina.admin@nexus.dz', password: await hash.make('password123'), role: 'admin', statut_compte: 'actif', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Sofia Amrani', email: 'sofia.amrani@nexus.dz', password: await hash.make('password123'), role: 'commercial', statut_compte: 'actif', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Yanis Belkacem', email: 'yanis.belkacem@nexus.dz', password: await hash.make('password123'), role: 'commercial', statut_compte: 'actif', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Lina Ouahab', email: 'lina.ouahab@nexus.dz', password: await hash.make('password123'), role: 'commercial', statut_compte: 'actif', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Karim Haddad', email: 'karim.haddad@nexus.dz', password: await hash.make('password123'), role: 'commercial', statut_compte: 'actif', created_at: new Date(), updated_at: new Date() },
      { full_name: 'Nassim Ait Ali', email: 'nassim.aitali@nexus.dz', password: await hash.make('password123'), role: 'commercial', statut_compte: 'inactif', created_at: new Date(), updated_at: new Date() },
    ]).returning('id')

    const uid = userRows.map((r: any) => r.id ?? r)
    const [adminId, com1, com2, com3, com4, com5] = uid

    // ---------- 2. ENTREPRISES (10 lignes) ----------
    const entRows = await db.table('entreprises').multiInsert([
      { nom: 'TechAlgeria SPA', secteur_activite: 'Informatique', adresse: 'Alger', telephone: '0550111111', email: 'contact@techalgeria.dz', statut: 'client', commercial_id: com1, created_at: new Date(), updated_at: new Date() },
      { nom: 'Boulangerie El Djazair', secteur_activite: 'Agroalimentaire', adresse: 'Blida', telephone: '0550111112', email: 'contact@eldjazair.dz', statut: 'prospect', commercial_id: com1, created_at: new Date(), updated_at: new Date() },
      { nom: 'Menuiserie Ouahab', secteur_activite: 'Bois', adresse: 'Tizi-Ouzou', telephone: '0550111113', email: 'menuiserie@ouahab.dz', statut: 'prospect', commercial_id: com2, created_at: new Date(), updated_at: new Date() },
      { nom: 'Pharma Plus', secteur_activite: 'Santé', adresse: 'Oran', telephone: '0550111114', email: 'contact@pharmaplus.dz', statut: 'client', commercial_id: com2, created_at: new Date(), updated_at: new Date() },
      { nom: 'Textile Azeffoun', secteur_activite: 'Textile', adresse: 'Azeffoun', telephone: '0550111115', email: 'contact@textileaz.dz', statut: 'prospect', commercial_id: com3, created_at: new Date(), updated_at: new Date() },
      { nom: 'Garage Moderne', secteur_activite: 'Automobile', adresse: 'Bejaia', telephone: '0550111116', email: 'garage@moderne.dz', statut: 'prospect', commercial_id: com3, created_at: new Date(), updated_at: new Date() },
      { nom: 'Librairie du Savoir', secteur_activite: 'Édition', adresse: 'Alger', telephone: '0550111117', email: 'contact@savoir.dz', statut: 'client', commercial_id: com4, created_at: new Date(), updated_at: new Date() },
      { nom: 'Traiteur Saveurs', secteur_activite: 'Restauration', adresse: 'Boumerdes', telephone: '0550111118', email: 'contact@saveurs.dz', statut: 'prospect', commercial_id: com4, created_at: new Date(), updated_at: new Date() },
      { nom: 'ElectroPlus SPA', secteur_activite: 'Électronique', adresse: 'Alger', telephone: '0550111119', email: 'contact@electroplus.dz', statut: 'prospect', commercial_id: com5, created_at: new Date(), updated_at: new Date() },
      { nom: 'Import Export Nord', secteur_activite: 'Commerce', adresse: 'Annaba', telephone: '0550111120', email: 'contact@importnord.dz', statut: 'client', commercial_id: com5, created_at: new Date(), updated_at: new Date() },
    ]).returning('id')

    const eid = entRows.map((r: any) => r.id ?? r)

    // ---------- 3. PRODUITS (10 lignes) ----------
    const prodRows = await db.table('produits').multiInsert([
      { nom: 'Licence CRM Standard', description: 'Licence annuelle 1 poste', prix: 15000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Licence CRM Pro', description: 'Licence annuelle 5 postes', prix: 55000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Formation utilisateur', description: 'Session de 2 jours', prix: 30000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Support technique annuel', description: 'Support 24/7', prix: 25000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Serveur dédié', description: 'Hébergement mensuel', prix: 12000, type: 'produit', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Module facturation', description: 'Extension CRM', prix: 8000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Module inventaire', description: 'Extension CRM', prix: 9000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Audit sécurité', description: 'Audit ponctuel', prix: 40000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Migration de données', description: 'Prestation unique', prix: 20000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
      { nom: 'Maintenance mensuelle', description: 'Contrat mensuel', prix: 5000, type: 'service', statut: 'actif', cree_par: adminId, created_at: new Date(), updated_at: new Date() },
    ]).returning('id')

    const pid = prodRows.map((r: any) => r.id ?? r)

    // ---------- 4. COMMANDES (10 lignes) ----------
    const cmdRows = await db.table('commandes').multiInsert([
      { entreprise_id: eid[0], commercial_id: com1, statut: 'validee', date_commande: '2026-05-10', date_validation: '2026-05-12', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[1], commercial_id: com1, statut: 'en_cours', date_commande: '2026-06-01', date_validation: null, created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[2], commercial_id: com2, statut: 'en_cours', date_commande: '2026-06-15', date_validation: null, created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[3], commercial_id: com2, statut: 'terminee', date_commande: '2026-04-20', date_validation: '2026-04-22', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[4], commercial_id: com3, statut: 'en_cours', date_commande: '2026-06-20', date_validation: null, created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[5], commercial_id: com3, statut: 'annulee', date_commande: '2026-03-05', date_validation: null, created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[6], commercial_id: com4, statut: 'validee', date_commande: '2026-05-28', date_validation: '2026-05-30', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[7], commercial_id: com4, statut: 'en_cours', date_commande: '2026-07-01', date_validation: null, created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[8], commercial_id: com5, statut: 'en_cours', date_commande: '2026-07-05', date_validation: null, created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[9], commercial_id: com5, statut: 'terminee', date_commande: '2026-02-14', date_validation: '2026-02-16', created_at: new Date(), updated_at: new Date() },
    ]).returning('id')

    const cid = cmdRows.map((r: any) => r.id ?? r)

    // ---------- 5. COMMANDE_PRODUITS (10 lignes) ----------
    await db.table('commande_produits').multiInsert([
      { commande_id: cid[0], produit_id: pid[0], quantite: 1, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[0], produit_id: pid[2], quantite: 2, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[1], produit_id: pid[1], quantite: 1, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[2], produit_id: pid[3], quantite: 1, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[3], produit_id: pid[4], quantite: 3, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[4], produit_id: pid[5], quantite: 1, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[5], produit_id: pid[6], quantite: 1, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[6], produit_id: pid[7], quantite: 1, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[7], produit_id: pid[8], quantite: 2, created_at: new Date(), updated_at: new Date() },
      { commande_id: cid[8], produit_id: pid[9], quantite: 1, created_at: new Date(), updated_at: new Date() },
    ])

    // ---------- 6. HISTORIQUES (10 lignes) ----------
    await db.table('historiques').multiInsert([
      { entreprise_id: eid[0], commercial_id: com1, commande_id: cid[0], type_action: 'validation', description: 'Commande validée avec succès', date_action: '2026-05-12', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[1], commercial_id: com1, commande_id: cid[1], type_action: 'echange', description: 'Premier contact téléphonique', date_action: '2026-06-01', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[2], commercial_id: com2, commande_id: cid[2], type_action: 'creation_prospect', description: 'Ajout du prospect', date_action: '2026-06-15', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[3], commercial_id: com2, commande_id: cid[3], type_action: 'validation', description: 'Commande terminée', date_action: '2026-04-22', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[4], commercial_id: com3, commande_id: cid[4], type_action: 'echange', description: 'Envoi de devis', date_action: '2026-06-20', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[5], commercial_id: com3, commande_id: cid[5], type_action: 'echange', description: 'Commande annulée par le client', date_action: '2026-03-05', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[6], commercial_id: com4, commande_id: cid[6], type_action: 'validation', description: 'Commande validée', date_action: '2026-05-30', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[7], commercial_id: com4, commande_id: cid[7], type_action: 'creation_prospect', description: 'Nouveau prospect ajouté', date_action: '2026-07-01', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[8], commercial_id: com5, commande_id: cid[8], type_action: 'echange', description: 'Relance par email', date_action: '2026-07-05', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[9], commercial_id: com5, commande_id: cid[9], type_action: 'validation', description: 'Client fidèle, commande récurrente', date_action: '2026-02-16', created_at: new Date(), updated_at: new Date() },
    ])

    // ---------- 7. TRANSFERTS_PROSPECTS (5 lignes) ----------
    await db.table('transferts_prospects').multiInsert([
      { entreprise_id: eid[1], ancien_commercial_id: com2, nouveau_commercial_id: com1, motif: 'Réaffectation zone géographique', date_transfert: '2026-05-20', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[4], ancien_commercial_id: com4, nouveau_commercial_id: com3, motif: 'Surcharge de travail', date_transfert: '2026-06-10', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[5], ancien_commercial_id: com1, nouveau_commercial_id: com3, motif: 'Spécialisation secteur automobile', date_transfert: '2026-02-28', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[8], ancien_commercial_id: com3, nouveau_commercial_id: com5, motif: 'Congé du commercial', date_transfert: '2026-07-02', created_at: new Date(), updated_at: new Date() },
      { entreprise_id: eid[2], ancien_commercial_id: com4, nouveau_commercial_id: com2, motif: 'Réorganisation équipe', date_transfert: '2026-06-18', created_at: new Date(), updated_at: new Date() },
    ])
  }
}