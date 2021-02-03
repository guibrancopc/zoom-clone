const server = require('http').createServer((request, response) => {
  response.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  })
  response.end('hey there!')
})

const shocketIo = require('socket.io')
const io = shocketIo(server, {
  cors: {
    origin: '*',
    credentials: false
  }
})

io.on('connection', socket => {
  // console.log('connection', socket.id)
  socket.on('join-room', (roomId, userData) => {

    // adiciona os usuarios na mesma sala
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userData)

    socket.on('disconnect', () => {
      // console.log('disconnected!', roomId, userData)
      socket.to(roomId).broadcast.emit('user-disconnected', userData)
    })
  })
})

const startServer = () => {
  const { address, port } = server.address()
  console.info(`app running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)