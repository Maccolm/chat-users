import UsersDBService from "../models/UsersDBService.mjs"
import { prepareToken } from "../utils/jwtHelper.mjs"

class AuthController {
	// ---- автентиікація -----
	static getLoginPage(req, res) {
		res.render('auth/loginForm', { errors: [], login: true })
	}
	static getSignupPage(req, res) {
		res.render('auth/loginForm', { errors: [], login: false })
	}
	static async login(req, res) {
		if (!req.body.email) {
			return res.status(401).render('auth/loginForm', { error: "Email is required" })
		}
		if (!req.body.password) {
			return res.status(401).render('auth/loginForm', { error: "Password is required" })
		}
		try {
			console.log("Finding user by email:", req.body.email)
			const user = await UsersDBService.findOne({
				email: req.body.email,
			})
			if (user) {
				console.log("User not found for email:", req.body.email)
				return res.status(401).render('auth/loginForm', { error: "User not found" })
			}
			console.log("Validating password for user:", user.email)
			const isValid = await UsersDBService.validPassword(req.body.email, req.body.password)
			console.log('password valid', isValid)
			if (!isValid) {
				console.log("Invalid password for user:", user.email)
				return res.status(401).render('auth/loginForm', { error: "Wrong password or email" })
			}
			console.log("Preparing token for user:", user.email)
			const token = prepareToken(
				{
					id: user._id,
					username: user.username,
				},
				req.headers
			);
			res.render( 'index' ,{
				result: "Authorized",
				token,
			})
		} catch (err) {
			console.error("Error in login:", err);
			res.status(401).render('auth/loginForm', { error: "Wrong password or email" });
		}
	}
	static async signup(req, res) { 
		console.log('signup Data=====>', req.body);
		
		if (!req.body.email) {
			return res.status(401).render('auth/loginForm', { error: "Email is required", login: false })
		}
		if (!req.body.password) {
			return res.status(401).render('auth/loginForm', { error: "Password is required", login: false })
		}
		try {
			console.log("Finding user by email:", req.body.email)
			
			const user = await UsersDBService.findOne({
				email: req.body.email,
			})
			if (user) {
				return res.status(401).render( 'auth/loginForm', { error: "User already exists", login: false })
			}
			//hash password
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(req.body.password, salt)
			
			//create new user
			const newUser = await UsersDBService.create({
				name: req.body.name,
				email: req.body.email,
				password: hashedPassword,
			})
			const token = prepareToken(
				{
					id: newUser._id,
					username: newUser.username,
				},
				req.headers
			);
			res.render( 'index' ,{
				result: "User created",
				token,
			})
		} catch (err) {
			console.error("Error in signup:", err)
			res.status(401).render('auth/loginForm', { error: "Error in signup", login: false })
		}
	}
	static checkIsLogged(req) {
		try{
			const token = req.cookies?.jwt_token;
			const user = token ? decodeToken(token) : null
		return user
	} catch (error) {
		console.error('Error decoding token:', error);
		return null;
 	 }
	}
	// ---- вихід -----
	static logout(req, res) {
		req.logout();
		res.render({ message: "Logged out successfully" });
	}
}
export default AuthController;
