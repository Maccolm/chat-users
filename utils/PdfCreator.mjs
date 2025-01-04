import ejs from 'ejs'
import pdf from 'html-pdf'

class PdfCreator {
  static async generatePdf(outputPath, templatePath, data) {
    const html = await ejs.renderFile(templatePath, data)
    return new Promise((resolve, reject) => {
      pdf.create(html).toFile(outputPath, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
  }
}

export default PdfCreator
