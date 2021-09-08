export default function createGame(word) {
  const pointsRef  = 10
  const state = {
     players : {},
     stopped : false,
     wordLength : 0,
     correctAnswerList : [],
     wrongAnswerList : [],
     points : [],
     tentatives : []
  }

  function end(endCommand){
    setState (endCommand)
  }

  const observers = []

  function subscribe(observerFunction){
    observers.push(observerFunction)
  }

  function notifyAll(command){
    for(const observerFunction of observers){
      observerFunction(command)
    }
  }


  function setState(newState){
    console.log('Received new game state: ')
    Object.assign(state, newState)
  }

  function getOpponentId(playerId){
    if (state.player1 === playerId){
      return state.player2
    }else if (state.player2 === playerId){
      return state.player1
    }else{
    return 'error'
    }
  }

  function playerLose(playerId){
    const winnerId = getOpponentId(playerId)
    console.log(winnerId)
    var command = {winner : winnerId,
    loser: playerId}

    end(command)

  }

  function setPlayerState(playerId, newState){
    console.log('Received new player state: ')
    const playerState = state.players[playerId]
    Object.assign(playerState, newState)
  }

  function addPlayer(command){
    const playerId = command.playerId
    const playerTentatives = 'tentatives' in command ? command.tentatives : 7
    const playerPoints = 'points' in command ? command.points : 100
    const playerIsHost = 'host' in command ? command.host : false

    state.players[playerId] = {
      tentatives : playerTentatives,
      points : playerPoints,
      host : playerIsHost,
      correctAnswerList: [],
      wrongAnswerList: [],
      wordLength: word.length
    }

    if (playerIsHost){
      setState({player1 : playerId})
    }else{
      setState({player2 : playerId})
    }

    notifyAll({
      type:'add-player',
      playerId: playerId
    })

    console.log(`Added new player as ${playerIsHost ? 'host' : 'guest'} with id ${playerId} with ${state.players[playerId].points} points and ${state.players[playerId].tentatives} tentatives`)
  }

  function removePlayer(playerId){
    delete state.players[playerId] 

    notifyAll({
      type:'remove-player',
      playerId: playerId,
    })
  }
  
  function sendGuess(){
    var input  = document.getElementById('guessLetter')
    var guess = input.value.toString() 
    guess = guess.charAt(0).toUpperCase()
    const command = {
      playerId: currentPlayers,
      guess: guess
    }
    playerGuess(command)
  }


return {
    playerGuess,
    addPlayer,
    state,
    setState,
    setPlayerState,
    playerLose,
    removePlayer,
    subscribe,
    end
  }
}