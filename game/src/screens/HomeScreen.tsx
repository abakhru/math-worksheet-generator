import { usePlayerStore } from '@/store/playerStore'
import { useProgressStore } from '@/store/progressStore'
import { getUnlockedTables } from '@/engine/mastery'
import './screens.css'

interface HomeScreenProps {
  onStartGame: (mode: 'practice' | 'explorer' | 'daily' | 'speedrun' | 'survival' | 'boss', table: number) => void
  onProfileClick: () => void
}

export default function HomeScreen({ onStartGame, onProfileClick }: HomeScreenProps) {
  const player = usePlayerStore((s) => s.player)
  const progress = useProgressStore((s) => s.progress)
  const unlockedTables = getUnlockedTables(progress)

  if (!player) return null

  return (
    <div className="screen home-screen">
      <div className="home-header">
        <h1 className="game-title">⏱️ Times Tables Quest</h1>
        <div className="player-badge">
          <span className="level-badge">{player.level}</span>
          <span className="player-name">{player.name}</span>
          <button className="profile-btn" onClick={onProfileClick}>
            ⚙️
          </button>
        </div>
      </div>

      <div className="mode-grid">
        <div className="mode-card" onClick={() => onStartGame('practice', 2)}>
          <div className="mode-icon">📚</div>
          <h2>Practice</h2>
          <p>Master any table</p>
        </div>

        <div className="mode-card" onClick={() => onStartGame('explorer', 2)}>
          <div className="mode-icon">🎨</div>
          <h2>Explorer</h2>
          <p>Visual learning</p>
        </div>

        <div className="mode-card" onClick={() => onStartGame('daily', 2)}>
          <div className="mode-icon">📅</div>
          <h2>Daily Challenge</h2>
          <p>Today's quiz</p>
        </div>

        <div className="mode-card" onClick={() => onStartGame('speedrun', 2)}>
          <div className="mode-icon">⚡</div>
          <h2>Speed Run</h2>
          <p>60 seconds</p>
        </div>

        <div className="mode-card" onClick={() => onStartGame('survival', 2)}>
          <div className="mode-icon">💪</div>
          <h2>Survival</h2>
          <p>3 lives</p>
        </div>

        <div className="mode-card" onClick={() => onStartGame('boss', unlockedTables[0])}>
          <div className="mode-icon">⚔️</div>
          <h2>Boss Battle</h2>
          <p>Defeat bosses</p>
        </div>
      </div>

      <div className="table-selector">
        <h3>Select Table</h3>
        <div className="table-buttons">
          {unlockedTables.map((table) => (
            <button
              key={table}
              className="table-btn"
              onClick={() => onStartGame('practice', table)}
            >
              {table}×
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
