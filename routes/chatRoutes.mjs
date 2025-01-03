import { Router } from 'express'
import ChatController from '../controllers/chatController.mjs'

const router = Router()

router.get('/', ChatController.getChatPage)
router.post('/generate-pdf', ChatController.generatePdf)
router.post('/send-pdf', ChatController.sendPdf)

export default router
