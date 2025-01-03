class UsersDBService {
	static async findOne(email) {
		const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])	
		return rows.length ? rows[0] : null
	}
	static async create({ name, email, password }) {
		const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password])
		return {
			id: result.insertId,
			email
		}
	}
	static async validPassword(email, password) {
		const [rows] = await db.query('SELECT password FROM users WHERE email = ?', [email])
		return await bcrypt.compare(password, rows[0].password)
	}
}
export default new UsersDBService