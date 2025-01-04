import session from 'express-session'
import config from './default.mjs'
const sessionConfig = session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
})

export default sessionConfig
