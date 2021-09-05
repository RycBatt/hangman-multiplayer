export default function createGame() {
  const state = {
     correctAnswerList : [],
     wrongAnswerList : [],
     player : [],
     guesses : [],
     stopped : false,
     guessResponse : {},
     wordLenght : 0,
  }

  function roundInit(wordLenght,){
    state.wordLensght = wordLenght
    }

  function addPlayer(playerId){
    var player = {id: playerId, tentatives: 7}
    state.player.push(player)
    console.log(`Added new player with id ${state.player.last().id} to the game with ${state.player.last().tentatives} tentatives`)
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

  function playerGuess(word, command) {
    var guessResponse

    command.guess = command.guess[0]
    console.log(`Player with id ${command.playerId} is guessing the letter ${command.guess}`)
    state.guesses.push(command.guess);

    if (state.stopped) 
    {
      console.log('parado')
    }
    if (word.indexOf(command.guess) < 0) {
      // Incorrect guess, increase our mistakes by one
      state.player[command.playerId].tentatives--
      guessResponse = 
          {
            value:'wrong',
            letter: command.guess
          }
      state.wrongAnswerList.push(guessResponse)
      // Check if its Game Over
      if (state.player[command.playerId].tentatives <= 0) {
        state.stopped = true;
      }
    }
    else if (word.indexOf(command.guess) >= 0) {
          guessResponse = 
          {
            value:'correct',
            letter: command.guess,
            positions: returnIndexes(word, command.guess)
          }
          console.log(guessResponse)
          state.correctAnswerList.push(guessResponse)
  }
  function returnIndexes(word, letter){
    var indices = [];
    for(var i=0; i<state.wordLenght;i++) {
        if (word[i] === letter) indices.push(i);
    }       
  return indices
  }
}
return {
    playerGuess,
    sendGuess,
    addPlayer,
    roundInit,
    state
  }
}

if (!Array.prototype.last){
  Array.prototype.last = function(){
      return this[this.length - 1];
  };
};