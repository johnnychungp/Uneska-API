import crypto from 'crypto'
import Promise from 'bluebird'
import config from 'config'

const randomBytes = Promise.promisify(crypto.randomBytes)
const passport = Promise.promisifyAll(require('koa-passport'))

export async function login(ctx, next) {
  return passport.authenticate('local', async (err, user) => {
    console.log(err, null)
    if (err || !user) {
      ctx.throw(401, 'loginFailure')
    }
    const token = user.generateToken()
    ctx.body = {
      token,
      user
    }
  })(ctx, next)
}
