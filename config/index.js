require('dotenv').config({ silent: true })

export default {
  siteURL: process.env.SITE_URL,
  port: process.env.PORT || 5000,
  database: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: false
  },
  jwtSecret: process.env.JWT
}