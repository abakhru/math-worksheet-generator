import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from '@/store/progressStore'

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.setState({
      progress: {},
      achievements: {},
      dailyMedals: {},
    })
    useProgressStore.getState().initializeProgress()
  })

  it('initializes all tables', () => {
    const progress = useProgressStore((s) => s.progress)
    expect(progress[2]).toBeDefined()
    expect(progress[12]).toBeDefined()
  })

  it('initializes table with zero progress', () => {
    const progress = useProgressStore((s) => s.progress)
    expect(progress[2].masteryPoints).toBe(0)
    expect(progress[2].stars).toBe(0)
    expect(progress[2].bossDefeated).toBe(false)
  })

  it('updates table progress', () => {
    useProgressStore.getState().updateTableProgress(3, {
      masteryPoints: 100,
      stars: 1,
    })

    const progress = useProgressStore((s) => s.progress)
    expect(progress[3].masteryPoints).toBe(100)
    expect(progress[3].stars).toBe(1)
  })

  it('adds mastery points and updates stars', () => {
    useProgressStore.getState().addMasteryPoints(4, 200)

    const progress = useProgressStore((s) => s.progress)
    expect(progress[4].masteryPoints).toBe(200)
    expect(progress[4].stars).toBe(1)
  })

  it('calculates stars correctly at thresholds', () => {
    const store = useProgressStore.getState()

    store.addMasteryPoints(5, 400)
    let progress = useProgressStore((s) => s.progress)
    expect(progress[5].stars).toBe(2)

    store.addMasteryPoints(5, 200) // Total 600
    progress = useProgressStore((s) => s.progress)
    expect(progress[5].stars).toBe(3)

    store.addMasteryPoints(5, 400) // Total 1000
    progress = useProgressStore((s) => s.progress)
    expect(progress[5].stars).toBe(5)
  })

  it('unlocks achievements', () => {
    useProgressStore.getState().unlockAchievement('first-answer')

    const achievements = useProgressStore((s) => s.achievements)
    expect(achievements['first-answer']).toBeDefined()
  })

  it('doesnt duplicate achievement unlocks', () => {
    const store = useProgressStore.getState()
    store.unlockAchievement('streak-3')
    const time1 = useProgressStore((s) => s.achievements['streak-3'])

    store.unlockAchievement('streak-3')
    const time2 = useProgressStore((s) => s.achievements['streak-3'])

    expect(time1).toEqual(time2)
  })

  it('adds daily medals by date', () => {
    useProgressStore.getState().addDailyMedal('2026-03-14')

    const medals = useProgressStore((s) => s.dailyMedals)
    expect(medals['2026-03-14']).toBeDefined()
  })

  it('calculates daily streak', () => {
    const store = useProgressStore.getState()
    const today = new Date()

    // Add medals for 3 consecutive days
    for (let i = 0; i < 3; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      store.addDailyMedal(dateStr)
    }

    const streak = store.getDailyStreak()
    expect(streak).toBe(3)
  })

  it('gets unlocked achievements list', () => {
    const store = useProgressStore.getState()
    store.unlockAchievement('first-answer')
    store.unlockAchievement('streak-3')

    const unlocked = store.getUnlockedAchievements()
    expect(unlocked).toContain('first-answer')
    expect(unlocked).toContain('streak-3')
    expect(unlocked.length).toBe(2)
  })

  it('persists to localStorage', () => {
    useProgressStore.getState().addMasteryPoints(2, 300)
    useProgressStore.getState().unlockAchievement('test-ach')

    const stored = localStorage.getItem('mg_progress')
    expect(stored).not.toBeNull()

    const data = JSON.parse(stored!)
    expect(data.state.progress[2].masteryPoints).toBe(300)
    expect(data.state.achievements['test-ach']).toBeDefined()
  })
})
