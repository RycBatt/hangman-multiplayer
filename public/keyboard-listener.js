export default function createKeyboardListener(document, socket) {


  document.getElementById("guessbtn").addEventListener('click', handleSubmit)
  const state = {
    observers:  [],
    playerId: null
  }
  function registerPlayerId(playerId){
    state.playerId = playerId
  }

  function subscribe(observerFunction){
    state.observers.push(observerFunction)
  }

  function notifyAll(command){
    console.log(`Notifying ${state.observers.length} observers`)
    for(const observerFunction of state.observers){
      observerFunction(command)
    }
  }

  function handleSubmit(){
    var input  = document.getElementById('guessLetter')
    var guess = input.value.toString() 
    guess = guess.charAt(0).toUpperCase()
    const command = 
    {
      playerId: state.playerId,
      guess: guess
    }
    socket.emit('player-guess', command)
    
  }
  return {
    subscribe,
    registerPlayerId
  }
}