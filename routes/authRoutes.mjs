<<<<<<< HEAD
import { Router } from 'express'
import AuthController from '../controllers/authController.mjs'
import passport from 'passport'

const router = Router()

router.get('/login', AuthController.getLoginPage)
router.get('/logout', AuthController.logout)
router.get('/signup', AuthController.getSignupPage)
router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)

export default router
=======
import { Router } from 'express'
import AuthController from '../controllers/authController.mjs'

const router = Router()

router.get('/login', AuthController.getLoginPage)
router.get('/logout', AuthController.logout)
router.get('/signup', AuthController.getSignupPage)
router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)

export default router
>>>>>>> d58aaa28b1aa515e803d342b917bf2bccb9d524e
