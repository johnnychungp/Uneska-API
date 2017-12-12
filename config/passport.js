import passport from 'koa-passport'
import { Strategy } from 'passport-local'
import User from 'models/user'

passport.serializeUser(({ id }, done) => done(null, id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.query().findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

passport.use(
  'local',
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      console.log('where am i?')
      try {
        const user = await User.query().where({ email }).first()
        console.log(user)
        if (!user) {
          return done('emailNotFound')
        }

        const match = await user.validatePassword(password)
        if (!match) {
          return done('incorrectPassword')
        }
        const now = new Date().toISOString()
        const updateUser = await user.$query().patch({ lastSeen: now }).first().returning('*')
        
        done(null, updateUser)
      } catch (err) {
        console.log("hello?")
        return done(err)
      }
    }
  )
)