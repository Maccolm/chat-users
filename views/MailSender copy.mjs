import config from '../config/default.mjs'
import nodemailer from 'nodemailer'
import fs from 'fs'
import PdfCreator from './PdfCreator.mjs'
import path from 'path'

class MailSender {
  static async sendMail(templatePath, data, recipientEmail) {
    const pdfPath = path.join(process.cwd(), 'chatContent.pdf')

    await PdfCreator.generatePdf(pdfPath, templatePath, data)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    })
    const mailOptions = {
      from: config.email.user,
      to: recipientEmail,
      subject: 'Your PDF Document',
      text: 'Please find the attached PDF document.',
      attachments: [
        {
          path: pdfPath,
        },
      ],
    }

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return reject(err)
        resolve(info)
        fs.unlinkSync(pdfPath) // Видаляємо PDF після відправлення
      })
    })
  }
}

export default MailSender
