
export default function renderScreen(screen, game, Images, playerId){
    var context = screen.getContext("2d")
    const playerState = game.state
    const wordLength = 'wordLength' in playerState ? playerState.wordLength : 0
    const correctAnswerList =playerState.correctAnswerList
    const wrongAnswerList =playerState.wrongAnswerList
    const tentatives =playerState.tentatives


    const bodyPartsPosition = [
      {
      position: [200, 200, 50, 50]
      },
      {
      position: [200, 250, 50, 50]
      },
      {
      position: [250, 250, 25, 50]
      },
      {
      position: [175, 250, 25, 50]
      },
      {
      position: [225, 300, 25, 50]
      },
      {
      position: [200, 300, 25, 50]
      }
    ]

    const letterBlock = {
      'posx' : 50,
      'posy' : 100,
      }
    const letterSize = 30
    const lettersPositions = Array.from({length: wordLength}, (v,x) => [x*letterSize + letterBlock.posx, letterBlock.posy])

    let positionDict = {}
    positionDict = lettersPositions.map(x => {
      return {posx: x[0], posy : x[1]}
    });
    context.fillStyle = 'white'
    context.clearRect(0,0,screen.width,screen.height)

    for (const letterPos in lettersPositions){
      const letter = lettersPositions[letterPos]
      context.fillStyle = 'black'
      context.fillRect(letter[0], letter[1], letterSize-5, 1)
      }
    for(const responses in correctAnswerList){
      const correctAnswer = correctAnswerList[responses]
        for (const correctGuess in correctAnswer.positions){
          const letter = correctAnswer.letter
          const position = correctAnswer.positions[correctGuess]
          context.font = "30px Arial"
          context.fillText(letter, positionDict[position].posx, positionDict[position].posy)
          }
      }
    for(const wrongAnswer in wrongAnswerList){
      context.drawImage(Images.get(wrongAnswer), bodyPartsPosition[wrongAnswer].position[0], bodyPartsPosition[wrongAnswer].position[1], bodyPartsPosition[wrongAnswer].position[2], bodyPartsPosition[wrongAnswer].position[3])
     }
    console.log(playerState.ended)
    if(game.state.end){
      //checa se o player é o vencedor
      if(playerState.winner ===playerId){
        console.log('ganhou')
        context.fillText('GANHOUUUUUU', 200, 200)

      }
      if(playerState.loser === playerId){
        console.log('perdeu')
        context.fillText('PERDEUUUUU', 200, 200)
      }
    }
    context.font = "15px Arial"
    context.fillText('Tentativas Restantes: '+ tentatives, 155, 480)

    }