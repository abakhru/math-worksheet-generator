import { useCallback, useEffect } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { usePlayerStore } from '@/store/playerStore'
import { useProgressStore } from '@/store/progressStore'
import { generateMultipleChoiceQuestion, generateQuestion } from '@/engine/questions'
import { audioEngine } from '@/engine/audio'
import { GameMode } from '@/types'
import './screens.css'

interface GameScreenProps {
  mode: GameMode
  table: number
  onComplete: () => void
}

export default function GameScreen({ mode, table, onComplete }: GameScreenProps) {
  const sessionState = useSessionStore((s) => s)
  const setQuestion = useSessionStore((s) => s.setQuestion)
  const selectAnswer = useSessionStore((s) => s.selectAnswer)
  const markAnswered = useSessionStore((s) => s.markAnswered)
  const addXP = usePlayerStore((s) => s.addXP)
  const addMasteryPoints = useProgressStore((s) => s.addMasteryPoints)
  const generateNextQuestion = useCallback(() => {
    const q = generateQuestion(table, mode)
    const mcQuestion = generateMultipleChoiceQuestion(q)
    setQuestion(mcQuestion)
  }, [table, mode, setQuestion])

  // Initialize session
  useEffect(() => {
    useSessionStore.getState().startSession(mode, table)
    generateNextQuestion()
  }, [mode, table, generateNextQuestion])

  const handleAnswerSelect = (selectedIdx: number) => {
    if (sessionState.answered) return

    selectAnswer(selectedIdx)
    const isCorrect = selectedIdx === sessionState.currentQuestion?.correctIndex

    // Audio feedback
    if (isCorrect) {
      audioEngine.correct()
    } else {
      audioEngine.wrong()
    }

    markAnswered(isCorrect)

    // Award XP and mastery
    if (isCorrect) {
      addXP(10)
      addMasteryPoints(table, 20)
    }

    // Next question after delay
    setTimeout(() => {
      generateNextQuestion()
    }, 500)
  }

  if (!sessionState.currentQuestion) {
    return <div className="screen game-screen loading">Loading...</div>
  }

  return (
    <div className="screen game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onComplete}>
          ← Back
        </button>
        <div className="game-stats">
          <span>{sessionState.questionsAnswered} questions</span>
          <span>{sessionState.correctAnswers} correct</span>
          {sessionState.comboMultiplier > 1 && (
            <span className="combo-badge">{sessionState.comboMultiplier}x combo</span>
          )}
        </div>
      </div>

      <div className="question-container">
        <div className="question">
          {sessionState.currentQuestion.a} × {sessionState.currentQuestion.b} = ?
        </div>
      </div>

      <div className="choices-grid">
        {sessionState.currentQuestion.choices.map((choice, idx) => (
          <button
            key={idx}
            className={`choice-btn ${sessionState.selectedAnswer === idx ? 'selected' : ''} ${
              sessionState.answered
                ? idx === sessionState.currentQuestion?.correctIndex
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
            onClick={() => handleAnswerSelect(idx)}
            disabled={sessionState.answered}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}
