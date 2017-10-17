import * as auth from './controller'

export const baseUrl = '/auth'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      auth.login
    ]
  },
  {
    method: 'POST',
    route: '/sendRecoveryEmail',
    handlers: [
      auth.sendRecoveryEmail
    ]
  },
  {
    method: 'POST',
    route: '/resetPassword',
    handlers: [
      auth.resetPassword
    ]
  }
]
