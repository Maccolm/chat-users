import UsersDBService from "../models/UsersDBService.mjs"
import { prepareToken } from "../utils/jwtHelper.mjs"
import bcrypt from 'bcrypt'
import express from 'express'
import session from 'express-session'
import passport from "passport"
import config from "../config/default.mjs"

class AuthController {
	// ---- автентиікація -----
	static getLoginPage(req, res) {
		 return res.render('auth/loginForm', { error: '', login: true})
	}
	static getSignupPage(req, res) {
		return res.render('auth/loginForm', { error: '', login: false })
	}
	static async login(req, res, next) {
		if (!req.body.email) {
			return res.status(401).render('auth/loginForm', { error: "Email is required", login: true })
		}
		if (!req.body.password) {
			return res.status(401).render('auth/loginForm', { error: "Password is required", login: true })
		}
		passport.authenticate('local', (err, user, info) => {
			if(err) {
				console.error("Error in login:", err)
				return next(err)
			}
			if(!user) {
				console.log("User not found for email:", user)
				return res.status(401).render('auth/loginForm', { error: "Wrong password or email", login: true })
			}

			req.login(user, (err) => {
				if (err) {
					console.error("Error in login:", err)
					return next(err)
				}
				console.log("Session:", req.session)
		
				return res.redirect('/')
			})
		})(req, res, next)
	}
	static async signup(req, res) { 
		if (!req.body.email) {
			return res.status(401).render('auth/loginForm', { error: "Email is required", login: false })
		}
		if (!req.body.password) {
			return res.status(401).render('auth/loginForm', { error: "Password is required", login: false })
		}
		try {
			
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
			)
			req.session.token = token

			return res.redirect('/')
		} catch (err) {
			if(err.code === 'ER_DUP_ENTRY') {
				console.log('Duplicate email', err.sqlMessage)
				return res.status(401).render('auth/loginForm', { error: "Email already exists", login: false })
			}
			console.error("Error in signup:", err)
			return res.status(401).render('auth/loginForm', { error: "Error in signup", login: false })
		}
	}
	// ---- вихід -----
	static logout(req, res) {
		req.logout((err) => {
			if (err) {
				console.error("Error in logout:", err)
				return res.status(500).render('error', { error: "Error in logout" })
			}
			 req.session.message = 'Logged out successfully'
			return res.redirect('/auth/login')
		})
	}
}
export default AuthController;

