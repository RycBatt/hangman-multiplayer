export default function createGame() {
  const state = {
    ended: false,
    players : {},
    wordLength : 0,
    correctAnswerList : [],
    wrongAnswerList : [],
    points : [],
    tentatives : []
 }
 function setState(newState){
  console.log('Received new game state: ')
  Object.assign(state, newState)
}
return{setState, state}
}