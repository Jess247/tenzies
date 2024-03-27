  import React from "react"
  import Die from "./Die.jsx"
  import {nanoid} from "nanoid"
  import Confetti from "react-confetti"

  export default function App() {

      const [dice, setDice] = React.useState(allNewDice())
      const [tenzies, setTenzies] = React.useState(false)
      const [time, setTime] = React.useState(60)
      const [isTimerStarted, setIsTimerStarted] = React.useState(false)

      React.useEffect(() => {
          const allHeld = dice.every(die => die.isHeld)
          const firstValue = dice[0].value
          const allSameValue = dice.every(die => die.value === firstValue)
          if (allHeld && allSameValue) {
              setTenzies(true)
          }
      }, [dice])

      React.useEffect(() => {
        const isHeld = dice.some(die => die.isHeld)
        if(isHeld && !isTimerStarted) {
          setIsTimerStarted(true)
        }
      },[dice, isTimerStarted])

      React.useEffect(() => {
        let timer
        if(isTimerStarted) {
          timer = setInterval((prevTime) => {
            setTime(prevTime => {
              if(prevTime === 0 || tenzies) {
                clearInterval(timer)
                setIsTimerStarted(false)
              } else {
                console.log(prevTime)
                return prevTime -1
              }
            }) 
          },1000)
        }
        return () => clearInterval(timer)
      },[isTimerStarted, tenzies])

      React.useEffect(() => {
        if(time === 0) {
          setTenzies(true)
          setIsTimerStarted(false)
          console.log("Times up")
        }
      }, [time]) 

      function generateNewDie() {
          return {
              value: Math.ceil(Math.random() * 6),
              isHeld: false,
              id: nanoid()
          }
      }
      
      function allNewDice() {
          const newDice = []
          for (let i = 0; i < 10; i++) {
              newDice.push(generateNewDie())
          }
          return newDice
      }
      
      function rollDice() {
          if(!tenzies) {
              setDice(oldDice => oldDice.map(die => {
                  return die.isHeld ? 
                      die :
                      generateNewDie()
              }))
          } else {
              setTenzies(false)
              setDice(allNewDice())
              setIsTimerStarted(false)
              setTime(60)
          }
      }
      
      function holdDice(id) {
          setDice(oldDice => oldDice.map(die => {
              return die.id === id ? 
                  {...die, isHeld: !die.isHeld} :
                  die
          }))
      }
      
      const diceElements = dice.map(die => (
          <Die 
              key={die.id} 
              value={die.value} 
              isHeld={die.isHeld} 
              holdDice={() => holdDice(die.id)}
          />
      ))
      
      return (
          <main>
              {tenzies && <Confetti />}
              <h2>Time: <span className="time">{time}</span></h2>
              <h1 className="title">Tenzies</h1>
              <p className="instructions">Roll until all dice are the same. 
              Click each die to freeze it at its current value between rolls.</p>
              <div className="dice-container">
                  {diceElements}
              </div>
              <button 
                  className="roll-dice" 
                  onClick={rollDice}
              >
                  {tenzies ? "New Game" : "Roll"}
              </button>
          </main>
      )
  }