import config from '../config/default.mjs'
// Імпортуємо необхідний модуль
import mysql from 'mysql2/promise'

// Функція для підключення до MySQL
async function connectToMySQL() {
  try {
    const pool = await mysql.createPool({
      host: config.db.mysql.host,
      user: config.db.mysql.user,
      password: config.db.mysql.password,
      database: config.db.mysql.database,
		port: config.db.mysql.port
	 })
    console.log('Успішно підключено до MySQL')
    return pool
  } catch (err) {
    console.error('Помилка підключення до MySQL:', err)
  }
}

const pool = await connectToMySQL()

export default pool
