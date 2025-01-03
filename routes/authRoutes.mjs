import { Router } from 'express'
import AuthController from '../controllers/authController.mjs'

const router = Router()

router.get('/login', AuthController.getLoginPage)
router.get('/logout', AuthController.logout)
router.get('/signup', AuthController.getSignupPage)
router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)

export default router
