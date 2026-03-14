import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Player } from '@/types'

interface PlayerStore {
  player: Player | null
  initializePlayer: (name: string) => void
  updateName: (name: string) => void
  updateAvatar: (avatarId: number) => void
  updateTheme: (themeId: 'candy' | 'space' | 'jungle' | 'underwater') => void
  addXP: (amount: number) => void
  updateSettings: (settings: Partial<Player['settings']>) => void
}

const generatePlayerId = () => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      player: null,

      initializePlayer: (name: string) => {
        set({
          player: {
            id: generatePlayerId(),
            name,
            avatarId: Math.floor(Math.random() * 12),
            themeId: 'candy',
            level: 1,
            totalXP: 0,
            settings: {
              soundEnabled: true,
              hapticEnabled: true,
              inputMode: 'multiple-choice',
            },
          },
        })
      },

      updateName: (name: string) => {
        set((state) => {
          if (!state.player) return state
          return {
            player: { ...state.player, name },
          }
        })
      },

      updateAvatar: (avatarId: number) => {
        set((state) => {
          if (!state.player) return state
          return {
            player: { ...state.player, avatarId },
          }
        })
      },

      updateTheme: (themeId) => {
        set((state) => {
          if (!state.player) return state
          return {
            player: { ...state.player, themeId },
          }
        })
      },

      addXP: (amount: number) => {
        set((state) => {
          if (!state.player) return state
          const totalXP = state.player.totalXP + amount

          // Recalculate level
          let level = 1
          let xpRequired = 100
          let accumulatedXP = 0

          while (accumulatedXP + xpRequired <= totalXP) {
            accumulatedXP += xpRequired
            level++
            xpRequired = Math.round(100 * level * 0.75)
          }

          return {
            player: { ...state.player, totalXP, level },
          }
        })
      },

      updateSettings: (settings) => {
        set((state) => {
          if (!state.player) return state
          return {
            player: {
              ...state.player,
              settings: { ...state.player.settings, ...settings },
            },
          }
        })
      },
    }),
    {
      name: 'mg_player',
      version: 1,
    }
  )
)
