import Koa from 'koa'
import cors from 'koa2-cors'
import devLogger from 'koa-logger'
import jsonLogger from 'koa-json-logger'
import bodyParser from 'koa-bodyparser'
import errorMiddleware from 'middleware/error'
import passport from 'koa-passport'
import config from 'config'

const app = new Koa()

if (process.env.NODE_ENV === 'production') {
  app.use(
    convert(
      jsonLogger({
        path: null
      })
    )
  )
} else {
  app.use(devLogger())
}

app.use(cors())
app.use(bodyParser())

app.use(errorMiddleware())

require('config/passport')
app.use(passport.initialize())

const modules = require('src/modules')
modules(app)

app.listen(config.port, () => {
  console.log(`Magic happens on ${config.port}`)
})

export default app