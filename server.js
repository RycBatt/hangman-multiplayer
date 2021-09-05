import express from 'express'
import http from 'http'
import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)

app.use(express.static('public'))

const game = createGame()
const player1id = '1'
const player2id = '2'
const word = 'LOLLIPOP'
const wordLenght = word.length
game.roundInit(wordLenght)
game.addPlayer(player1id)
game.addPlayer(player2id)
const command = {
  playerId: player1id,
  guess: 'O'
}
game.playerGuess(word, command)

console.log(game.state)

server.listen(3000, () =>{
  console.log('Server listening on port 3000')
})
