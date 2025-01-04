import pool from "../db/connectDB.mjs"
import bcrypt from 'bcrypt'

class UsersDBService {
	async findOne(email) {
		const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])	
		return rows.length ? rows[0] : null
	}
	async create({ name, email, password }) {
		const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password])
		return {
			id: result.insertId,
			email
		}
	}
	async findById(id) {
		const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
		return rows.length ? rows[0] : null
	}
	async validPassword(email, password) {
		const [rows] = await pool.query('SELECT password FROM users WHERE email = ?', [email])
		return await bcrypt.compare(password, rows[0].password)
	}
}
export default new UsersDBService