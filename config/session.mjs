import session from 'express-session'
import config from './default.mjs'
const sessionConfig = session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Оновлює час сесії при кожному запиті
  cookie: {
		maxAge: 1000 * 60 * 30, // 30 хвилин у мілісекундах
		httpOnly: true,         // Забезпечує безпеку cookie
		secure: false           
  }
})

export default sessionConfig
