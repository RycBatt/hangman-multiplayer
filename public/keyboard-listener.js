export default function createKeyboardListener(document) {
  document.getElementById("guessbtn").addEventListener('click', handleSubmit)
  const state = {
    observers:  []
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
      playerId: 'player1',
      guess: guess
    }
    notifyAll(command)
  }
  return {
    subscribe
  }
}