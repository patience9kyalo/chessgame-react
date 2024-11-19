import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import './App.css';

function App() {
  
  //state initialization
  const [game, setGame] = useState(new Chess())// current chess game initialized as a new chess instance
  const [winner, setWinner] = useState(null) //stores the name of the winning side("Black" or "White")
  const [gameOver, setGameOver] = useState(false) //boolean indicating if the game is over

  
  // this function keeps the games updates consistent by cloning the game state and applying modifications via a callback(modify)
  function safeGameMutate(modify) { 
    setGame((g) => { 
      const update = { ...g }
      modify(update)
      return update
    })
  }

    //this function makes a random move for the computer
  function makeRandomMove() {
    const possibleMove = game.moves()

    if (game.game_over() || game.in_draw() || possibleMove.length === 0) {// checks if the game is over or in a draw
      setGameOver(true)
      const winner = game.turn() === 'w' ? 'Black':'White'
      setWinner(winner)
      return
    }

    //if the game continues , it selects a random move from possibleMove and applies it using safeGameMutate
    const randomIndex = Math.floor(Math.random() * possibleMove.length)

    safeGameMutate((game) => {
      game.move(possibleMove[randomIndex])
    })
  }

  //function that handles the users piece moves.

  function onDrop(source, target) {

    if (gameOver) return false
    let move = null //if the game is over it prevents further moves

    safeGameMutate((game) => {
      move = game.move({
        from: source,
        to: target, //checks if the users move from source to target is valid
        promotion: 'q',
      })
    })

    if (move === null) return false

    setTimeout(makeRandomMove, 200) // if the move is valid it lets the computer make the move with a 200ms delay
    return true
  }

  //this function resets the game by creating a new chess instance and clearing the gameover and winner states

  function restartGame() {
    setGame(new Chess())
    setGameOver(false)
    setWinner(null)
  }

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        restartGame()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, []) // when the enter key is pressed the useEffect triggers the restrtgame function allowing player to restart game.

  return (
    <div className='app'>
      <div className='header'>
        <img src='https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png' alt='Game Image' className='game-image'/>
        <div className='game-info'>
          <h1>Chess Game</h1>
        </div>
      </div>
      <div className='chessboard-container'>
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        {gameOver && (
          <div className='game-over'> <p>Game Over</p> <p>Winner:{winner}</p><p>Press Enter to restart</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default App;
