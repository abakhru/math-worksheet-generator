# GitHub Actions CI/CD Workflows

Automated testing, building, and deployment for Times Tables Quest.

## Workflows

### 1. **test-and-build.yml** (Test & Build)
Runs on: Push to `dev`/`main`, Pull requests

**Steps:**
- Install dependencies with bun
- Type check with TypeScript
- Run linter
- Execute unit & integration tests
- Build production bundle
- Verify PWA assets
- Upload build artifacts

**Success criteria:**
- ✅ All tests pass
- ✅ No type errors
- ✅ Build completes < 500KB
- ✅ Service worker generated

### 2. **security.yml** (Security Scan)
Runs on: Push to `dev`/`main`, PRs, Daily schedule (2 AM UTC)

**Checks:**
- Snyk dependency vulnerability scan
- Outdated packages detection
- TypeScript strict checks
- ESLint code quality
- Console.log detection in production

**Alerts:** HIGH and CRITICAL vulnerabilities block merge

### 3. **pwa-check.yml** (PWA Validation)
Runs on: Push to `dev`/`main`, Pull requests

**Validates:**
- ✅ `manifest.webmanifest` exists and is valid
- ✅ Service worker (`sw.js`) generated
- ✅ Offline assets precached
- ✅ Lighthouse PWA audit (optional)
- ✅ Core app files present

**Output:** PWA readiness report

### 4. **release.yml** (Release & Deploy)
Runs on: Manual trigger or push to `main`

**Steps:**
1. Run all tests and type checks
2. Build production
3. Create GitHub Release with tag
4. Deploy to GitHub Pages (if Pages enabled)
5. Generate release notes

**Manual trigger:**
```bash
# Via GitHub UI or CLI
gh workflow run release.yml -f version=1.0.0
```

### 5. **status-check.yml** (Quick Status)
Runs on: Push and PRs

**Quick validation:**
- TypeScript check
- Linting
- Build size
- Test file detection
- Post PR comment with summary

**Output:** Summary artifact + PR comment

## Environment Variables

No required secrets for basic CI. Optional:

- `SNYK_TOKEN` — For Snyk vulnerability scanning
- `GITHUB_TOKEN` — Auto-injected (no setup needed)

## Deployment

### GitHub Pages
1. Enable GitHub Pages in Settings → Pages
2. Set source to "GitHub Actions"
3. Release workflow automatically deploys to `gh-pages` branch
4. App available at: `https://<owner>.github.io/<repo>/`

### Custom Hosting
Export build artifacts:
- `game/dist/` — Complete PWA app
- `game/dist/manifest.webmanifest` — PWA manifest
- `game/dist/sw.js` — Service worker
- `game/dist/index.html` — Entry point

Deploy all files to static host (Vercel, Netlify, AWS S3, etc.)

## Local Testing

Run workflows locally with [act](https://github.com/nektos/act):

```bash
# Test the build workflow
act push -j test-and-build

# Test security checks
act push -j code-quality

# Test PWA validation
act push -j pwa-validation
```

## Monitoring

### Build Status Badge
Add to README.md:
```markdown
![Test & Build](https://github.com/<owner>/<repo>/workflows/Test%20&%20Build/badge.svg)
![Security](https://github.com/<owner>/<repo>/workflows/Security%20Scan/badge.svg)
![PWA](https://github.com/<owner>/<repo>/workflows/PWA%20Validation/badge.svg)
```

### Artifact Retention
- Build artifacts: 7 days
- Status reports: 7 days
- Releases: Forever

## Troubleshooting

### Build timeout
If workflow takes > 30 min, increase timeout in YAML:
```yaml
timeout-minutes: 45
```

### Dependency install fails
Clear cache:
1. Settings → Actions → General
2. Clear all caches
3. Re-run workflow

### Deploy fails
Check:
- GitHub Pages enabled in Settings
- Branch protection rules don't block deployments
- `GITHUB_TOKEN` has write permissions

## Next Steps

- [ ] Set up Snyk token for security scanning
- [ ] Configure GitHub Pages for deployment
- [ ] Add deployment status notifications to Slack/Discord
- [ ] Set up automated dependency updates (Dependabot)
- [ ] Add code coverage reporting (Codecov)
- [ ] Configure branch protection rules to require passing checks
