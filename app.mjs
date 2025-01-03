import express from 'express'
import http from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import chatRoutes from './routes/chatRoutes.mjs'
import ChatController from './controllers/chatController.mjs'
import authRoutes from './routes/authRoutes.mjs'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(cookieParser())
app.use('/', chatRoutes)
app.use('/auth', authRoutes)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

wss.on('connection', (ws) => {
  console.log('New client connected')

  ws.on('message', async (messageData, isBinary) => {
    console.log(`Received: ${messageData}`)
    const messageDataObj = JSON.parse(messageData)
    await ChatController.saveMessage(messageDataObj)

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageData, { binary: isBinary })
      }
    })
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
