import config from '../config/default.mjs' // Імпортуємо конфігураційні параметри
import nodemailer from 'nodemailer' // Імпортуємо nodemailer для відправки електронних листів
import fs from 'fs' // Імпортуємо fs для роботи з файловою системою
import PdfCreator from './PdfCreator.mjs' // Імпортуємо клас PdfCreator для створення PDF-файлів
import path from 'path' // Імпортуємо path для роботи з шляхами файлів
class MailSender {
  static async sendMail(templatePath, data, mailData) {
    const pdfPath = path.join(process.cwd(), 'chatContent.pdf') // Визначаємо шлях для збереження PDF-файлу
    await PdfCreator.generatePdf(pdfPath, templatePath, data) // Створюємо PDF-файл з використанням PdfCreator
    // Налаштовуємо транспорт для надсилання електронної пошти за допомогою nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user, // Використовуємо електронну пошту з конфігурації
        pass: config.email.password, // Використовуємо пароль з конфігурації
      },
    })
    const mailOptions = {
      // Налаштовуємо параметри електронного листа
      from: config.email.user, // Відправник листа
      to: mailData.recipientEmail, // Одержувач листа
      subject: mailData.subject, // Тема листа
      text: mailData.text, // Текст листа
      attachments: [{ path: pdfPath }], // Вкладення
    }
    return new Promise((resolve, reject) => {
      // Надсилаємо лист за допомогою транспорту і видаляємо PDF-файл після відправки
      transporter.sendMail(mailOptions, (err, info) => {
        fs.unlinkSync(pdfPath) // Видаляємо PDF-файл після відправлення
        if (err) return reject(err) // Обробляємо помилку відправки
        resolve(info) // Повертаємо інформацію про успішне відправлення
      })
    })
  }
}
export default MailSender // Експортуємо клас MailSender як модуль ES6
