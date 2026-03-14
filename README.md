# Times Tables Quest

An **offline-capable multiplication learning game** for iOS and Android (PWA). Genuinely fun, fully playable without a server, with sound effects, particle effects, daily streaks, and achievement unlocks.

## Features

- **6 Game Modes**: Practice, Explorer, Daily Challenge, Speed Run, Survival, Boss Battle
- **Mastery System**: Earn 0–5 stars per multiplication table (2–12)
- **Unlock Tree**: Tables unlock progressively as you master previous ones
- **Achievements**: 19 unlockable achievements from first answer to defeating all bosses
- **Audio**: 100% synthesized via Web Audio API (no files, works offline)
- **PWA**: Installable on iOS/Android home screen, full offline support
- **Themes**: 4 visual themes (Candy, Space, Jungle, Underwater)
- **Persistence**: All progress saved to localStorage

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **State**: Zustand + localStorage
- **Audio**: Web Audio API (no files)
- **FX**: Framer Motion, Canvas particles
- **Package Manager**: bun
- **PWA**: vite-plugin-pwa + Workbox

## Quick Start

### Development
```bash
just game-install   # Install dependencies
just game-dev       # Start dev server on http://localhost:5173
```

### Production Build
```bash
just game-build     # Build optimized bundle
just check          # Run all checks (type, lint, build)
```

## Directory Structure

```
game/
├── public/                 # PWA manifest, icons
├── src/
│   ├── engine/            # Pure TS game logic
│   │   ├── questions.ts   # Question generation, PRNG
│   │   ├── scoring.ts     # Points, XP, level calculation
│   │   ├── mastery.ts     # Per-table mastery, unlock tree
│   │   ├── achievements.ts # Achievement unlock logic
│   │   └── audio.ts       # Web Audio API synthesizer
│   ├── store/             # Zustand stores + localStorage
│   ├── screens/           # Main app views
│   ├── components/        # Reusable React components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── themes/            # CSS theme variables
│   └── App.tsx            # Main app component
├── index.html             # Entry point
├── vite.config.ts         # Vite + PWA config
├── tsconfig.json          # TypeScript config
└── package.json
```

## Game Modes

| Mode | Description | Unlock |
|---|---|---|
| **Practice** | Pick any table, infinite questions, no timer | Always |
| **Explorer** | Visual 20×20 grid, tap to see dot-array representations | Always |
| **Daily Challenge** | 20 questions, date-seeded (same for everyone), medals | Always |
| **Speed Run** | 60s sprint, correct +2s / wrong −3s, combo multiplier | Level 3 |
| **Survival** | 3 lives, mixed tables, streak-10 restores a heart | Level 5 |
| **Boss Battle** | Defeat table bosses (10 HP each) to earn badges | 3★ on table |

## Unlock System

- **Tables**: 2, 5, 10 always unlocked; others require previous table at 2★
- **Modes**: Speed Run & Survival unlock at Level 3 & 5; Boss Battle requires 3★ on any table
- **Achievements**: 19 total, unlock by reaching milestones (streaks, levels, daily streaks, boss defeats)

## Verification

```bash
just game-install
just game-dev        # Open http://localhost:5173

# In the app:
# 1. Complete 1 Practice round → verify XP gain
# 2. Complete 1 Speed Run → verify timer mechanics
# 3. Defeat a Boss → verify HP system
# 4. Complete Daily Challenge → verify date-seeded questions
# 5. Refresh page → verify localStorage persists progress

# PWA Check (Chrome DevTools):
# → Application → Service Workers → Verify registered
# → Application → Cache Storage → Verify offline content cached

# iOS (Safari):
# → Share → Add to Home Screen → Launch standalone
# → Verify safe-area insets (notch + home bar)

# Lighthouse:
# → DevTools → Lighthouse → Run audit → Verify PWA score
```
