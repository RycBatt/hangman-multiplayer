import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from "socket.io";

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static('public'))

const word = 'LOLLIPOP'

const game = createGame(word)

game.subscribe((command)=>{
  console.log(`Emitting ${command.type}`)
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket)=>{

  const playerId = socket.id
  console.log(`>>> Player connected on Server with id ${playerId}`)


  console.log(`current players ${Object.keys(game.state.players).length}`)

  if (Object.keys(game.state.players).length === 1){
    game.addPlayer({playerId : playerId, host: false})
    sockets.emit('setup', game.state.players[playerId])
  }else{
    game.addPlayer({playerId : playerId, host: true})
  }

  socket.on('teste', (msg)=>{
    console.log(msg)
    socket.emit('teste2', 'mensagemaleatoria')
  })

  socket.on('player-guess', (msg) =>{
    console.log('entrou em palyer-guess')
    game.playerGuess(msg)
    if(game.state.ended){
      socket.emit('game-ended', (game.state.players[playerId]))
    }
    socket.emit('guess-response', (game.state.players[playerId]))
  })

  socket.on('did-game-ended', ()=>{
    if(game.state.ended){
      socket.emit('game-ended', 'yes')
    }else{
      console.log('no')
    }
  })
  
  socket.on('disconnect', () => {
    game.removePlayer({playerId : playerId})
    console.log(`>>> Player ${playerId} disconnected from server`)
  })
})



server.listen(4000, () =>{
  console.log('Server listening on port 4000')
})
