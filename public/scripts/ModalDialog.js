class ModalDialog {
  constructor(filePath, fileContent, callback) {
    this.filePath = filePath
    this.fileContent = fileContent
    this.callback = callback
    this.createDialog()
  }
  createDialog() {
    // Створення контейнера для діалогового вікна
    this.modal = document.createElement('div')
    this.modal.style.position = 'fixed'
    this.modal.style.top = '50%'
    this.modal.style.left = '50%'
    this.modal.style.transform = 'translate(-50%, -50%)'
    this.modal.style.backgroundColor = 'white'
    this.modal.style.padding = '20px'
    this.modal.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)'
    this.modal.style.zIndex = '1000' // Додавання вмісту діалогового вікна
    if (this.fileContent.startsWith('data:image/')) {
      const img = document.createElement('img')
      img.src = this.fileContent
      img.style.maxWidth = '200px'
      this.modal.appendChild(img)
    } else {
      const video = document.createElement('video')
      video.src = this.fileContent
      video.controls = true
      video.style.maxWidth = '200px'
      this.modal.appendChild(video)
    }
    // Додавання текстового поля та кнопки "Надіслати"
    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter your message'
    this.modal.appendChild(input)

    const button = document.createElement('button')
    button.innerText = 'Надіслати'
    button.addEventListener('click', this.handleSend.bind(this, input))
    this.modal.appendChild(button)

    const closeButton = document.createElement('button')
    closeButton.innerText = 'Відмінити'
    closeButton.addEventListener('click', this.close.bind(this))
    this.modal.appendChild(closeButton)

    document.body.appendChild(this.modal)
  }
  handleSend(input) {
    const message = input.value
    // const image = this.fileContent // this.filePath.split(',')[1]
    // // Отримання base64 вмісту
    this.callback({ msg: message, fileData: this.fileContent })
    this.close()
  }
  close() {
    document.body.removeChild(this.modal)
  }
}
