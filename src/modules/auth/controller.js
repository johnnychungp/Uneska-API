import passport from 'koa-passport'
import crypto from 'crypto'
import Promise from 'bluebird'
import config from 'config'

const randomBytes = Promise.promisify(crypto.randomBytes)

export async function login(ctx, next) {
  console.log(ctx.request.body)
  return passport.authenticate('local', (grabber) => {
    if (!grabber) {
      ctx.throw(401, 'loginFailure')
    }

    const token = grabber.generateToken()

    ctx.body = {
      token,
      grabber: grabber.toJSON()
    }
  })(ctx, next)
}

export async function sendRecoveryEmail(ctx) {
  const { email } = ctx.request.body
  const grabber = await Grabber.where({email}).fetch()

  if (!grabber) ctx.throw(400, 'Email not found')
  const buf = await randomBytes(16)
  const token = buf.toString('hex')
  const expiry = new Date().valueOf() + 3600000
  await grabber.save({passwordResetToken: token, resetTokenExpiry: new Date(expiry)}, { patch: true })
  const resetLink = `${config.siteURL}/reset-password/${token}`
  await emails.resetPassword(grabber.toJSON(), resetLink)
  ctx.body = {}
}

export async function resetPassword(ctx, next) {
  const { passwordResetToken, newPassword } = ctx.request.body
  const grabber = await Grabber.where({ password_reset_token: passwordResetToken }).fetch()
  if (!grabber) return ctx.throw(404, 'token not found.')
  if (grabber.get('resetTokenExpiry') < new Date()) {
    grabber.set({
      resetTokenExpiry: null,
      passwordResetToken: null
    }, {
      patch: true
    })

    await grabber.save()
    return ctx.throw(498, 'token expired')
  }
  grabber.set({
    resetTokenExpiry: null,
    passwordResetToken: null,
    password: newPassword
  }, {
    patch: true
  })

  await grabber.save()

  const token = grabber.generateToken()
  ctx.body = {
    token,
    grabber
  }
}
