import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.show_login': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.create': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'admin.settings.update': { paramsTuple?: []; params?: {} }
    'commercial.dashboard': { paramsTuple?: []; params?: {} }
    'contacts.index': { paramsTuple?: []; params?: {} }
    'contacts.create': { paramsTuple?: []; params?: {} }
    'contacts.store': { paramsTuple?: []; params?: {} }
    'contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'echanges.index': { paramsTuple?: []; params?: {} }
    'echanges.create': { paramsTuple?: []; params?: {} }
    'echanges.store': { paramsTuple?: []; params?: {} }
    'commandes.create': { paramsTuple?: []; params?: {} }
    'commandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commandes.store': { paramsTuple?: []; params?: {} }
    'commandes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commercial.commandes.index': { paramsTuple?: []; params?: {} }
    'commercial.settings.update': { paramsTuple?: []; params?: {} }
    'commercial.settings': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.show_login': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.create': { paramsTuple?: []; params?: {} }
    'products.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'commercial.dashboard': { paramsTuple?: []; params?: {} }
    'contacts.index': { paramsTuple?: []; params?: {} }
    'contacts.create': { paramsTuple?: []; params?: {} }
    'contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'echanges.index': { paramsTuple?: []; params?: {} }
    'echanges.create': { paramsTuple?: []; params?: {} }
    'commandes.create': { paramsTuple?: []; params?: {} }
    'commandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commercial.commandes.index': { paramsTuple?: []; params?: {} }
    'commercial.settings': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.show_login': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.create': { paramsTuple?: []; params?: {} }
    'products.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.settings': { paramsTuple?: []; params?: {} }
    'commercial.dashboard': { paramsTuple?: []; params?: {} }
    'contacts.index': { paramsTuple?: []; params?: {} }
    'contacts.create': { paramsTuple?: []; params?: {} }
    'contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'echanges.index': { paramsTuple?: []; params?: {} }
    'echanges.create': { paramsTuple?: []; params?: {} }
    'commandes.create': { paramsTuple?: []; params?: {} }
    'commandes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commercial.commandes.index': { paramsTuple?: []; params?: {} }
    'commercial.settings': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.settings.update': { paramsTuple?: []; params?: {} }
    'contacts.store': { paramsTuple?: []; params?: {} }
    'contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'contacts.transfer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'echanges.store': { paramsTuple?: []; params?: {} }
    'commandes.store': { paramsTuple?: []; params?: {} }
    'commandes.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'commercial.settings.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}