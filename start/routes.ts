import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import AdminDashboardController from '#controllers/admin/dashboard_controller'
import AdminClientsController from '#controllers/admin/clients_controller'
import AdminUsersController from '#controllers/admin/users_controller'
import AdminProductsController from '#controllers/admin/products_controller'
import AdminSettingsController from '#controllers/admin/settings_controller'
import CommercialDashboardController from '#controllers/commercial/dashboard_controller'
import CommercialEchangesController from '#controllers/commercial/echanges_controller'
import CommercialCommandesController from '#controllers/commercial/commandes_controller'
import CommercialSettingsController from '#controllers/commercial/settings_controller'
import CommercialContactsController from '#controllers/commercial/contacts_controller'

router.get('/', ({ response }) => response.redirect('/login'))
router.get('/login', [AuthController, 'showLogin'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout'])

// Espace Admin
router.group(() => {
  router.get('/dashboard', [AdminDashboardController, 'index']).as('admin.dashboard')
  
  router.get('/clients', [AdminClientsController, 'index'])

  router.get('/utilisateurs', [AdminUsersController, 'index'])

  router.get('/produits', [AdminProductsController, 'index'])
  router.get('/produits/creer', [AdminProductsController, 'create'])
  router.post('/produits', [AdminProductsController, 'store'])
  router.get('/produits/:id/edit', [AdminProductsController, 'edit'])
  router.post('/produits/:id/update', [AdminProductsController, 'update'])
  router.post('/produits/:id/delete', [AdminProductsController, 'destroy'])


  router.get('/parametres', [AdminSettingsController, 'index']).as('admin.settings')
  router.post('/parametres', [AdminSettingsController, 'update']).as('admin.settings.update')
}).prefix('/admin').use([middleware.auth(), middleware.role({ roles: ['admin'] })])

// Espace Commercial
router.group(() => {
  router.get('/dashboard', [CommercialDashboardController, 'index']).as('commercial.dashboard')


  router.get('/contacts', [CommercialContactsController, 'index'])
  router.get('/contacts/creer', [CommercialContactsController, 'create'])
  router.post('/contacts', [CommercialContactsController, 'store'])
  router.get('/contacts/:id', [CommercialContactsController, 'show'])
  router.get('/contacts/:id/edit', [CommercialContactsController, 'edit'])
  router.post('/contacts/:id/update', [CommercialContactsController, 'update'])
  router.post('/contacts/:id/delete', [CommercialContactsController, 'destroy'])
  router.post('/contacts/:id/transfer', [CommercialContactsController, 'transfer'])
  
  router.get('/echanges', [CommercialEchangesController, 'index'])
  router.get('/echanges/creer', [CommercialEchangesController, 'create'])
  router.post('/echanges', [CommercialEchangesController, 'store'])

  router.get('/commandes/creer', [CommercialCommandesController, 'create'])
  router.get('/commandes/:id', [CommercialCommandesController, 'show'])
  router.post('/commandes', [CommercialCommandesController, 'store'])
  router.post('/commandes/:id/delete', [CommercialCommandesController, 'destroy'])
  router.get('/commandes', [CommercialCommandesController, 'index']).as('commercial.commandes.index')

  router.post('/parametres', [CommercialSettingsController, 'update']).as('commercial.settings.update')
  router.get('/parametres', [CommercialSettingsController, 'index']).as('commercial.settings')
}).prefix('/commercial').use([middleware.auth(), middleware.role({ roles: ['commercial'] })])