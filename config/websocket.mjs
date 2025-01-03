import { WebSocketServer } from 'ws'
import pool from '../db/connectDB.mjs'

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server })
  wss.on('connection', (ws) => {
    console.log('New client connected')
    ws.on('message', async (message) => {
      const msg = JSON.parse(message)
      if (msg.type === 'create_room') {
        const roomId = await createRoom(msg.roomName, msg.password)
        ws.send(JSON.stringify({ type: 'room_created', roomId }))
      } else if (msg.type === 'join_room') {
        const valid = await validateRoom(msg.roomId, msg.password)
        ws.send(
          JSON.stringify({ type: valid ? 'room_joined' : 'invalid_password' })
        )
      } else if (msg.type === 'message') {
        await saveMessage(msg.roomId, msg.nickname, msg.message)
        broadcastMessage(wss, msg.roomId, msg.nickname, msg.message)
      }
    })
    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })
  const createRoom = async (roomName, password) => {
    const [result] = await pool.execute(
      'INSERT INTO rooms (name, password) VALUES (?, ?)',
      [roomName, password]
    )
    return result.insertId
  }
  const validateRoom = async (roomId, password) => {
    const [rows] = await pool.execute(
      'SELECT * FROM rooms WHERE id = ? AND password = ?',
      [roomId, password]
    )
    return rows.length > 0
  }
  const saveMessage = async (roomId, nickname, message) => {
    await pool.execute(
      'INSERT INTO messages (room_id, nickname, message) VALUES (?, ?, ?)',
      [roomId, nickname, message]
    )
  }
  const broadcastMessage = (wss, roomId, nickname, message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
        client.send(
          JSON.stringify({ type: 'message', roomId, nickname, message })
        )
      }
    })
  }
}
export default setupWebSocket
