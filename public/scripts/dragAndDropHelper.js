class DragAndDrop {
  constructor(containerId, callback) {
    this.container = document.getElementById(containerId)
    this.callback = callback
    // Додавання обробників подій для drag and drop
    this.container.addEventListener('dragover', this.handleDragOver.bind(this))
    this.container.addEventListener('drop', this.handleDrop.bind(this))
  }
  handleDragOver(event) {
    event.preventDefault()
  }

  handleDrop(event) {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileContent = e.target.result
        this.callback(file, fileContent)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Тільки файли зображень дозволені.')
    }
  }
}
