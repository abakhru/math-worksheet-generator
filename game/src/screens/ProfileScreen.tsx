import { usePlayerStore } from '@/store/playerStore'
import { useProgressStore } from '@/store/progressStore'
import './screens.css'

interface ProfileScreenProps {
  onBack: () => void
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const player = usePlayerStore((s) => s.player)
  const progress = useProgressStore((s) => s.progress)
  const updateTheme = usePlayerStore((s) => s.updateTheme)
  const updateSettings = usePlayerStore((s) => s.updateSettings)

  if (!player) return null

  const masteredTables = Object.values(progress).filter((p) => p.stars >= 5).length
  const totalCorrect = Object.values(progress).reduce((sum, p) => sum + p.stats.correct, 0)

  return (
    <div className="screen profile-screen">
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h2>Level {player.level}</h2>
          <p>Total XP: {player.totalXP}</p>
        </div>

        <div className="profile-card">
          <h3>Stats</h3>
          <p>Correct Answers: {totalCorrect}</p>
          <p>Mastered Tables: {masteredTables}/11</p>
        </div>

        <div className="profile-card">
          <h3>Theme</h3>
          <div className="theme-picker">
            {['candy', 'space', 'jungle', 'underwater'].map((theme) => (
              <button
                key={theme}
                className={`theme-btn ${player.themeId === theme ? 'active' : ''}`}
                onClick={() => updateTheme(theme as any)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <h3>Settings</h3>
          <label className="setting">
            <input
              type="checkbox"
              checked={player.settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            />
            Sound Effects
          </label>
          <label className="setting">
            <input
              type="checkbox"
              checked={player.settings.hapticEnabled}
              onChange={(e) => updateSettings({ hapticEnabled: e.target.checked })}
            />
            Haptic Feedback
          </label>
        </div>
      </div>
    </div>
  )
}
