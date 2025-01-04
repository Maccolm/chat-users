import db from '../db/connectDB.mjs'

import PdfCreator from '../utils/PdfCreator.mjs'
import MailSender from '../utils/MailSender.mjs'
import path from 'path'
import AuthController from './authController.mjs'

const __dirname = path.resolve()

class ChatController {
  static async getChatPage(req, res) {
    try {
      const [messages] = await db.execute('SELECT * FROM messages')
		// check if user is logged in

		console.log('user', req.user);
		
      res.render('index', { messages, hideTools: false, user: req.user })
    } catch (err) {
      console.error('Database error:', err)
      res.status(500).send('Database error')
    }
  }

  static async saveMessage(messageDataObj) {
    try {
      await db.execute('INSERT INTO messages (userID, msg, fileData) VALUES (?, ?)', [
			messageDataObj.userID,
			messageDataObj.msg,
        messageDataObj.fileData ?? '',
      ])
      console.log('Message saved to database')
    } catch (err) {
      console.error('Database error:', err)
    }
  }

  static async generatePdf(req, res) {
    try {
      const [messages] = await db.execute('SELECT * FROM messages')
      // const pdfCreator = new PdfCreator(
      //   path.join(__dirname, 'views', 'index.ejs'),
      //   { messages }
      // )
      console.log()

      // console.log('------ messages')
      // console.log(messages)

      await PdfCreator.generatePdf(
        path.join(__dirname, 'public', 'chat.pdf'),
        path.join(__dirname, 'views', 'index.ejs'),
        { messages, hideTools: true }
      )
      res.sendFile(path.join(__dirname, 'public', 'chat.pdf'))
    } catch (err) {
      console.error('PDF generation error:', err)
      res.status(500).send('PDF generation error')
    }
  }

  static async sendPdf(req, res) {
    const { email } = req.body
    try {
      const [messages] = await db.execute('SELECT * FROM messages')
      await MailSender.sendMail(
        path.join(__dirname, 'views', 'index.ejs'),
        { messages, hideTools: true },
        {
          recipientEmail: email,
          subject: 'Your chat history', // Тема листа
          text: 'Please find the attached PDF document.', // Текст листа
        }
      )
      res.send('PDF sent to email.')
    } catch (err) {
      console.error('PDF sending error:', err)
      res.status(500).send('PDF sending error')
    }
  }
}

export default ChatController
