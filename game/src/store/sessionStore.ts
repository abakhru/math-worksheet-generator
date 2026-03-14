import { create } from 'zustand'
import { SessionState, GameMode, MultipleChoiceQuestion } from '@/types'

interface SessionStoreState extends SessionState {
  currentQuestion: MultipleChoiceQuestion | null
  selectedAnswer: number | null
  answered: boolean
}

interface SessionStore extends SessionStoreState {
  startSession: (mode: GameMode, table: number) => void
  setQuestion: (question: MultipleChoiceQuestion) => void
  selectAnswer: (answer: number) => void
  markAnswered: (correct: boolean) => void
  updateCombo: (streak: number, newCombo: number) => void
  updateTimer: (timeRemaining: number) => void
  resetSession: () => void
  takeDamage: () => void
  restoreLive: () => void
  damageToHP: (damage: number) => void
}

const initialState: SessionStoreState = {
  mode: 'practice',
  currentTable: 2,
  questionsAnswered: 0,
  correctAnswers: 0,
  streak: 0,
  comboMultiplier: 1,
  timeRemaining: 60,
  lives: 3,
  bossHP: 10,
  currentQuestion: null,
  selectedAnswer: null,
  answered: false,
}

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,

  startSession: (mode: GameMode, table: number) => {
    set({
      mode,
      currentTable: table,
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      comboMultiplier: 1,
      timeRemaining: 60,
      lives: 3,
      bossHP: 10,
      currentQuestion: null,
      selectedAnswer: null,
      answered: false,
    })
  },

  setQuestion: (question: MultipleChoiceQuestion) => {
    set({
      currentQuestion: question,
      selectedAnswer: null,
      answered: false,
    })
  },

  selectAnswer: (answer: number) => {
    set({ selectedAnswer: answer })
  },

  markAnswered: (correct: boolean) => {
    set((state) => ({
      questionsAnswered: state.questionsAnswered + 1,
      correctAnswers: correct ? state.correctAnswers + 1 : state.correctAnswers,
      answered: true,
      streak: correct ? state.streak + 1 : 0,
      comboMultiplier: correct ? Math.min(state.comboMultiplier + 1, 5) : 1,
    }))
  },

  updateCombo: (streak: number, newCombo: number) => {
    set({
      streak,
      comboMultiplier: newCombo,
    })
  },

  updateTimer: (timeRemaining: number) => {
    set({ timeRemaining })
  },

  resetSession: () => {
    set(initialState)
  },

  takeDamage: () => {
    set((state) => ({
      lives: Math.max(0, state.lives - 1),
    }))
  },

  restoreLive: () => {
    set((state) => ({
      lives: Math.min(state.lives + 1, 3),
    }))
  },

  damageToHP: (damage: number) => {
    set((state) => ({
      bossHP: Math.max(0, state.bossHP - damage),
    }))
  },
}))
