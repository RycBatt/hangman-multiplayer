export default function createGame(word) {
  const pointsRef  = 10
  const state = {
     ended: false,
     players : {},
     wordLength : 0,
     correctAnswerList : [],
     wrongAnswerList : [],
     points : [],
     tentatives : []
  }

  function end(loserId, winnerId, endCommand){
    console.log(endCommand)

    setPlayerState(loserId, endCommand)
    setPlayerState(winnerId, endCommand)
    setState(endCommand)
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
    console.log(playerId + 'PERDEU TUDO O DRAMA...')
    const winnerId = getOpponentId(playerId)
    console.log(winnerId)
    var command = {ended : true, winner : winnerId,
    loser: playerId}

    end(playerId, winnerId, command)

  }

  function playerWin(playerId){
    const loserId = getOpponentId(playerId)
    console.log(loserId)
    var command = {ended: true, winner : playerId,
    loser: loserId}

    end(loserId, playerId, command)
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

  function removePlayer(command){
    const playerId = command.playerId
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
  }

  function playerGuess(command) {
    

    const playerId = command.playerId
    var playerGuess = command.guess
    word = word.toString().toUpperCase()
    playerGuess = playerGuess.toString() 
    playerGuess = playerGuess.charAt(0).toUpperCase()

    if (state.ended)
    {
      console.log('cabo o joguim')
      return
    } 
    if(playerId in state.players){
      console.log('de boa')
    }else{
      console.log('cant find player in state')
      return
    }

    //get current values of player
    const currPlayerPoints = state.players[playerId].points
    const currPlayerTentatives = state.players[playerId].tentatives
    const currPlayerCorrectList = state.players[playerId].correctAnswerList
    const currPlayerWrongList = state.players[playerId].wrongAnswerList
    // auxiliar variable to set final state of the player
    var newPlayerState  = {}
    console.log(`Player with id ${playerId} is guessing the letter ${playerGuess} TENTATIVES ${currPlayerTentatives}`)

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
      newPlayerCorrectAnswerList.push({letter: playerGuess, positions: returnIndexes(word, playerGuess)})
      
      newPlayerState = {correctAnswerList : newPlayerCorrectAnswerList,
        points : currPlayerPoints + pointsRef
      }
      var count = 0
      for (const [key, value] of Object.entries(newPlayerCorrectAnswerList)) {
        for (const letter in value.letter){
          for(var i=0; i<word.length;i++) {
            var aux = 0
            if (word[i] === value.letter && aux === 0) {
              count ++
              aux = 1
            }
          }
        }

        }
        console.log(count)
        if (count === word.length){
          console.log(playerId + 'WON!!!')
          playerWin(playerId)
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
    removePlayer,
    subscribe,
    end
  }
}