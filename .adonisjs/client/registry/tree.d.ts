/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    showLogin: typeof routes['auth.show_login']
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
  }
  admin: {
    dashboard: typeof routes['admin.dashboard']
  }
  commercial: {
    dashboard: typeof routes['commercial.dashboard']
  }
}
