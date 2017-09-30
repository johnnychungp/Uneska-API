import Koa from 'koa'
import cors from 'koa2-cors'
import devLogger from 'koa-logger'
import jsonLogger from 'koa-json-logger'
import bodyParser from 'koa-bodyparser'

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

// response
app.use(ctx => {
  ctx.body = 'Hello Koa'
})

app.listen(3000)