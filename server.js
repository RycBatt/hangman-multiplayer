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
game.addPlayer({ playerId: '4Ffoo9KnBczy8ibyAAABç', host: false} )
game.addPlayer({ playerId: 'SERTFYGHTRC4VGHBVYCT', host: true} )

game.setState({wordLength: word.length})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'O'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'l'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})
game.playerGuess({playerId : '4Ffoo9KnBczy8ibyAAABç', guess : 'A'})


console.log(game.state)

sockets.on('connection', (socket)=>{
  const playerId = socket.id
  console.log(`>>> Player connected on Server with id ${playerId}`)
  game.addPlayer({playerId : playerId, host: true})
  console.log(game.state.players[playerId])
  socket.emit('setup', game.state.players[playerId])
})

server.listen(3000, () =>{
  console.log('Server listening on port 3000')
})
