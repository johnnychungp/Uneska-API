import passport from 'koa-passport'
import moment from 'moment'
import { Strategy } from 'passport-local'

passport.serializeUser(({ id }, done) => done(null, id))

passport.deserializeUser(async (id, done) => {
  try {
    const grabber = await Grabber.where({ id }).fetch({ require: true })
    done(null, grabber)
  } catch (err) {
    console.log(err)
    done(err)
  }
})

passport.use('local', new Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const grabber = await Grabber.where({ email }).fetch()

    if (!grabber) {
      return done(null, false)
    }

    try {
      const match = await grabber.validatePassword(password)
      if (!match) {
        return done(null, false)
      }

      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      grabber.set('lastSeen', now)
      await grabber.save()

      done(null, grabber)
    } catch (err) {
      done(err)
    }
  } catch (err) {
    return done(err)
  }
}))
