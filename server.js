const http = require('http');
const app = require('./app');
const socket = require('socket.io')

const port = process.env.PORT || 5000;


const server = http.createServer(app);

server.listen(port);

let io = socket(server);

io.on('connection', function (socket) {
  console.log('made socket connection', socket.id);
  socket.on('addPlayerData', function (data) {
    io.sockets.emit('addPlayerData', JSON.stringify(data))
  })
  socket.on('delAllPlayers', function () {
    io.sockets.emit('delAllPlayers')
  })
  socket.on('randomizeTeam', function (data) {
    io.sockets.emit('randomizeTeam', JSON.stringify(data))
  })
  socket.on('removeOnePlayer', function (data) {
    // console.log(data);
    // console.log(JSON.stringify(data));
    // console.log(JSON.parse(data));
    io.sockets.emit('removeOnePlayer', JSON.stringify(data))
    // io.sockets.emit('removeOnePlayer', data)
  })
  // socket.on('removeOnePlayer', function () {
  //   io.sockets.emit('removeOnePlayer')
  // })
})