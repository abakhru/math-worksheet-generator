import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useProgressStore } from '@/store/progressStore'
import HomeScreen from '@/screens/HomeScreen'
import GameScreen from '@/screens/GameScreen'
import ProfileScreen from '@/screens/ProfileScreen'
import './App.css'

type Screen = 'home' | 'game' | 'profile'

function App() {
  const player = usePlayerStore((s) => s.player)
  const initializePlayer = usePlayerStore((s) => s.initializePlayer)
  const initializeProgress = useProgressStore((s) => s.initializeProgress)
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [gameMode, setGameMode] = useState<
    'practice' | 'explorer' | 'daily' | 'speedrun' | 'survival' | 'boss' | null
  >(null)
  const [selectedTable, setSelectedTable] = useState<number>(2)

  // Initialize stores on first load
  useEffect(() => {
    if (!player) {
      initializePlayer('Player')
      initializeProgress()
    }
  }, [player, initializePlayer, initializeProgress])

  // Apply theme
  useEffect(() => {
    if (player?.themeId) {
      document.body.className = `theme-${player.themeId}`
    }
  }, [player?.themeId])

  const handleStartGame = (
    mode: 'practice' | 'explorer' | 'daily' | 'speedrun' | 'survival' | 'boss',
    table: number
  ) => {
    setGameMode(mode)
    setSelectedTable(table)
    setCurrentScreen('game')
  }

  const handleGameComplete = () => {
    setCurrentScreen('home')
    setGameMode(null)
  }

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <HomeScreen
          onStartGame={handleStartGame}
          onProfileClick={() => setCurrentScreen('profile')}
        />
      )}
      {currentScreen === 'game' && gameMode && (
        <GameScreen mode={gameMode} table={selectedTable} onComplete={handleGameComplete} />
      )}
      {currentScreen === 'profile' && <ProfileScreen onBack={() => setCurrentScreen('home')} />}
    </div>
  )
}

export default App
