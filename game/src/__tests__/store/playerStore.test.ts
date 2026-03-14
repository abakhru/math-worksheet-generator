import { describe, it, expect, beforeEach } from 'vitest'
import { usePlayerStore } from '@/store/playerStore'

describe('playerStore', () => {
  beforeEach(() => {
    usePlayerStore.getState().player = null
  })

  it('initializes with null player', () => {
    const player = usePlayerStore((s) => s.player)
    expect(player).toBeNull()
  })

  it('initializes player with default values', () => {
    usePlayerStore.getState().initializePlayer('Alice')
    const player = usePlayerStore((s) => s.player)

    expect(player).not.toBeNull()
    expect(player?.name).toBe('Alice')
    expect(player?.level).toBe(1)
    expect(player?.totalXP).toBe(0)
    expect(player?.themeId).toBe('candy')
    expect(player?.settings.soundEnabled).toBe(true)
    expect(player?.settings.hapticEnabled).toBe(true)
  })

  it('generates unique player ID', () => {
    usePlayerStore.getState().initializePlayer('Bob')
    const id1 = usePlayerStore((s) => s.player?.id)

    usePlayerStore.getState().initializePlayer('Carol')
    const id2 = usePlayerStore((s) => s.player?.id)

    expect(id1).not.toEqual(id2)
  })

  it('updates player name', () => {
    usePlayerStore.getState().initializePlayer('Player')
    usePlayerStore.getState().updateName('NewName')
    const name = usePlayerStore((s) => s.player?.name)

    expect(name).toBe('NewName')
  })

  it('updates avatar', () => {
    usePlayerStore.getState().initializePlayer('Player')
    usePlayerStore.getState().updateAvatar(5)
    const avatar = usePlayerStore((s) => s.player?.avatarId)

    expect(avatar).toBe(5)
  })

  it('updates theme', () => {
    usePlayerStore.getState().initializePlayer('Player')
    usePlayerStore.getState().updateTheme('space')
    const theme = usePlayerStore((s) => s.player?.themeId)

    expect(theme).toBe('space')
  })

  it('adds XP and updates level', () => {
    usePlayerStore.getState().initializePlayer('Player')
    usePlayerStore.getState().addXP(100)

    const player = usePlayerStore((s) => s.player)
    expect(player?.totalXP).toBe(100)
    expect(player?.level).toBeGreaterThan(1)
  })

  it('updates settings', () => {
    usePlayerStore.getState().initializePlayer('Player')
    usePlayerStore.getState().updateSettings({ soundEnabled: false })

    const settings = usePlayerStore((s) => s.player?.settings)
    expect(settings?.soundEnabled).toBe(false)
    expect(settings?.hapticEnabled).toBe(true)
  })

  it('persists to localStorage', () => {
    const { initializePlayer } = usePlayerStore.getState()
    initializePlayer('LocalPlayer')

    const stored = localStorage.getItem('mg_player')
    expect(stored).not.toBeNull()

    const data = JSON.parse(stored!)
    expect(data.state.player?.name).toBe('LocalPlayer')
  })
})
