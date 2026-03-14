set shell := ["bash", "-uc"]

# Show available recipes
default:
    @just --list

# Install game dependencies
game-install:
    cd game && bun install

# Start game dev server
game-dev:
    cd game && bun run dev

# Build game for production
game-build:
    cd game && bun run build

# TypeScript type check
game-typecheck:
    cd game && bun run type-check

# Run linter
game-lint:
    cd game && bun run lint

# Format code
game-format:
    cd game && bun run format

# Run all checks (type, lint, build)
check: game-typecheck game-lint game-build

# Clean all artifacts
clean:
    rm -rf game/dist game/.vite game/node_modules
    rm -rf .DS_Store .ruff_cache || true
