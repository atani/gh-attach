# gh-attach

Upload images to GitHub Issue/PR comments and insert them with fixed width.

Works with both GitHub.com and GitHub Enterprise.

## Requirements

- [gh CLI](https://cli.github.com/) (authenticated)
- [playwright-cli](https://github.com/microsoft/playwright-mcp) (for image upload)

## Install

### Homebrew (recommended)

```bash
# Install (also installs gh, node, playwright-cli)
brew install atani/tap/gh-attach

# First run: login to GitHub in browser (one time only)
gh-attach --issue 1 --image ./test.png --headed
```

### Manual

1. Install dependencies:

```bash
# gh CLI (if not installed)
brew install gh
gh auth login

# playwright-cli
npm install -g @playwright/mcp
```

2. Add to PATH:

```bash
# Option A: Symlink
ln -s /path/to/gh-attach/bin/gh-attach /usr/local/bin/gh-attach

# Option B: Add to PATH
export PATH="/path/to/gh-attach/bin:$PATH"
```

### First run

Login to GitHub in the browser session:

```bash
gh-attach --issue 1 --image ./test.png --headed
# Browser opens → Login to GitHub → Session is saved for future use
```

## Usage

### Basic

```bash
gh-attach --issue 123 --image ./screenshot.png
```

### With comment body

```bash
gh-attach --issue 123 --image ./e2e.png --body "E2E test result:"
```

### Multiple images

```bash
gh-attach --issue 123 \
  --image ./before.png \
  --image ./after.png \
  --body 'Before: <!-- gh-attach:IMAGE:1 -->
After: <!-- gh-attach:IMAGE:2 -->'
```

### From file

```bash
gh-attach --issue 123 --image ./result.png --body-file report.md
```

## Placeholders

Control where images are inserted in the comment body:

| Placeholder | Description |
|-------------|-------------|
| `<!-- gh-attach:IMAGE -->` | Single image (or first image) |
| `<!-- gh-attach:IMAGE:1 -->` | First image (numbered) |
| `<!-- gh-attach:IMAGE:2 -->` | Second image |
| `<!-- gh-attach:IMAGE:N -->` | N-th image |

If no placeholder is present, images are appended to the end.

## Options

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `--issue <number>` | Yes | - | Issue or PR number |
| `--image <path>` | Yes | - | Image file (can be repeated) |
| `--repo <owner/repo>` | No | current repo | Target repository |
| `--width <px>` | No | 500 | Image width in pixels |
| `--body <text>` | No | - | Comment body text |
| `--body-file <path>` | No | - | Read body from file |
| `--host <host>` | No | auto-detected | GitHub host (for Enterprise) |
| `--headed` | No | - | Show browser window |

## How it works

1. Create a comment with placeholder(s)
2. Open GitHub in browser via playwright-cli
3. Upload image(s) using GitHub's native upload
4. Extract the uploaded URL(s)
5. Update the comment with `<img>` tags

## Notes

- PR comments use the same API as issue comments (use PR number)
- Images are inserted as HTML: `<img src="..." width="500" alt="...">`
- Browser session is persisted, so login is only needed once
- Use `--headed` to debug or when login is required
