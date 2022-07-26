
// const cors = require('cors')
// app.use(cors())

/*
  "dependencies": {
        "cors": "^2.8.5",
        "ejs": "^3.1.3",
        "express": "^5.0.0-alpha.2",
        "peer": "^0.5.3",
        "peerjs": "^1.3.1",
        "socket.io": "^2.3.0",
        "uuid": "^8.3.0"
      } 
*/



//const cors = require('cors')
//app.use(cors())


// criando um servidor  de Aplicacao 
const express = require('express')
const app = express()
// Traduzido do inglês-Socket.IO é uma biblioteca JavaScript para aplicativos da web em tempo real.
// Permite comunicação bidirecional em tempo real entre clientes e servidores da Web
const server = require('http').Server(app)
const io = require('socket.io')(server)
/*
PeerJS é uma ótima biblioteca para usar se você precisar domar a besta WebRTC
e habilite facilmente os recursos de chamada de vídeo e áudio em seu aplicativo da web. É conveniente começar e fornece todos os meios necessários para ajudá-lo a se preparar
*/
/*P2P pontoa  ponto */
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true 
});


const { v4: uuidV4 } = require('uuid')
// gerar strings randomicas para conferencia
app.use('/peerjs', peerServer);

/*
O EJS é uma engine de visualização, com ele conseguimos de uma maneira fácil e simples transportar dados do back-end para o front-end,
 basicamente conseguimos utilizar códigos
*/ 
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})
/*puxando a  sala criada */ 
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
//conexao socket  para sala passando idSala e usuario
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    // emitir menssagem para conectar via socket
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // menssagens
    socket.on('message', (message) => {
      //menssagens na mesma sala
      io.to(roomId).emit('createMessage', message)
  }); 
    socket.on('disconnect', () => {
      // emitir menssagem para desconectar
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
// aqui mostra servidor 
server.listen(process.env.PORT||3030)



