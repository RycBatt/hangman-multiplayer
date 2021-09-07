export default function createGame(word) {
  const pointsRef  = 10
  const state = {
     players : {},
     stopped : false
  }

  function end(endCommand){
    setState (endCommand)
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

    console.log(`Added new player as ${playerIsHost ? 'host' : 'guest'} with id ${playerId} with ${state.players[playerId].points} points and ${state.players[playerId].tentatives} tentatives`)
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

  function playerGuess(command) {
    const playerId = command.playerId
    var playerGuess = command.guess
    word = word.toString().toUpperCase()
    playerGuess = playerGuess.toString() 
    playerGuess = playerGuess.charAt(0).toUpperCase()

    //get current values of player
    const currPlayerPoints = state.players[playerId].points
    const currPlayerTentatives = state.players[playerId].tentatives
    const currPlayerCorrectList = state.players[playerId].correctAnswerList
    const currPlayerWrongList = state.players[playerId].wrongAnswerList
    // auxiliar variable to set final state of the player
    var newPlayerState  = {}

    console.log(`Player with id ${playerId} is guessing the letter ${playerGuess}`)

    if (word.indexOf(playerGuess) < 0) {
      // Incorrect guess, increase our mistakes by one
      var newPlayerWrongAnswerList = currPlayerWrongList
      newPlayerWrongAnswerList.push(playerGuess)
      newPlayerState = {wrongAnswerList : newPlayerWrongAnswerList,
      tentatives : currPlayerTentatives - 1}
      // Check if its Game Over for that player
      if (currPlayerTentatives <= 0) {
        return playerLose(playerId)
      }
    }
    else if (word.indexOf(playerGuess) >= 0) {
      // correct guess
      var newPlayerCorrectAnswerList = currPlayerCorrectList
      newPlayerCorrectAnswerList.push([playerGuess,returnIndexes(word, playerGuess)])
      
      newPlayerState = {correctAnswerList : newPlayerCorrectAnswerList,
        points : currPlayerPoints + pointsRef
      }
    }
    setPlayerState(playerId, newPlayerState)
    }

  function returnIndexes(word, letter){
    word = word.toString().toUpperCase()
    letter = letter.toString() 
    letter = letter.charAt(0).toUpperCase()
    var indices = [];
    for(var i=0; i<word.length;i++) {
        if (word[i] === letter) indices.push(i);
    }
  return indices
  }

return {
    playerGuess,
    addPlayer,
    state,
    setState,
    setPlayerState,
    playerLose,
    end
  }
}