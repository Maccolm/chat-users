import passport from 'passport'
import UsersDBService from '../models/UsersDBService.mjs'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import bcrypt from 'bcrypt'

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await UsersDBService.findOne(email)
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: 'Invalid email or password' })
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: 'YOUR_GOOGLE_CLIENT_ID',
      clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
      callbackURL: '/auth/google/callback',
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const email = profile.emails[0].value
        const nickname = profile.displayName
        let user = await User.findByEmail(email)
        if (!user) {
          const userId = await User.create({ email, nickname, password: token })
          user = { id: userId, email, nickname }
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsersDBService.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport
