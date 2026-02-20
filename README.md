# gh-attach

> **⚠️ This repository is archived.** [playwright-cli](https://github.com/microsoft/playwright-cli) can replace gh-attach's functionality. See [Migration to playwright-cli](#migration-to-playwright-cli) below.

Upload images to GitHub Issue/PR comments and insert them with fixed width.

Works with both GitHub.com and GitHub Enterprise.

## Migration to playwright-cli

gh-attach is no longer maintained. You can achieve the same result using playwright-cli's file chooser:

```bash
# 1. Open the Issue page
playwright-cli open "https://github.com/owner/repo/issues/123"

# 2. Get element references
playwright-cli snapshot

# 3. Click the "Paste, drop, or click to add files" button
playwright-cli click <ref>

# 4. File chooser opens — select your image
#    → After upload, the textarea auto-inserts:
#      ![image](https://github.com/.../user-attachments/assets/xxx)

# 5. Extract the URL from the textarea
playwright-cli snapshot

# 6. Use gh api to post the comment with the image URL
gh api repos/owner/repo/issues/123/comments -f body='![screenshot](https://github.com/.../user-attachments/assets/xxx)'
```

Key differences from gh-attach:
- No custom upload policy handling — uses GitHub's native file attachment UI
- No dependency on internal GitHub APIs that break across GHE versions
- Comment posting is done via `gh api`, not through the browser

---

## Requirements

- [gh CLI](https://cli.github.com/) (authenticated)
- [playwright-cli](https://github.com/microsoft/playwright-mcp) (browser/direct mode, not needed for `--release` mode)
- [jq](https://jqlang.github.io/jq/) (direct mode only)

## Install

### Homebrew (recommended)

```bash
brew tap atani/tap  # first time only
brew install gh-attach

# First run: login to GitHub in browser
gh-attach --issue 1 --image ./test.png --headed
```

### gh extension

```bash
gh extension install atani/gh-attach

# Use as: gh attach
gh attach --issue 123 --image ./screenshot.png
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

### Release mode (no browser needed)

```bash
gh-attach --issue 123 --image ./screenshot.png --release
```

### Direct mode (GHE)

For hosts configured in `~/.config/gh-attach/config`, direct mode is auto-enabled. This uploads via the upload policies API + curl, producing `user-attachments` URLs without creating release artifacts.

```bash
# ~/.config/gh-attach/config
# direct_hosts=your-ghe-host.com

gh-attach --issue 123 --image ./screenshot.png --host your-ghe-host.com --repo owner/repo
```

Use `--browser` to override and force browser mode:

```bash
gh-attach --issue 123 --image ./screenshot.png --browser
```

### From file

```bash
gh-attach --issue 123 --image ./result.png --body-file report.md
```

## Placeholders

Control where images are inserted in the comment body:

| Placeholder                  | Description                   |
| ---------------------------- | ----------------------------- |
| `<!-- gh-attach:IMAGE -->`   | Single image (or first image) |
| `<!-- gh-attach:IMAGE:1 -->` | First image (numbered)        |
| `<!-- gh-attach:IMAGE:2 -->` | Second image                  |
| `<!-- gh-attach:IMAGE:N -->` | N-th image                    |

If no placeholder is present, images are appended to the end.

## Options

| Option                | Required | Default          | Description                                 |
| --------------------- | -------- | ---------------- | ------------------------------------------- |
| `--issue <number>`    | Yes      | -                | Issue or PR number                          |
| `--image <path>`      | Yes      | -                | Image file (can be repeated)                |
| `--repo <owner/repo>` | No       | current repo     | Target repository                           |
| `--width <px>`        | No       | 800              | Image width in pixels                       |
| `--body <text>`       | No       | -                | Comment body text                           |
| `--body-file <path>`  | No       | -                | Read body from file                         |
| `--host <host>`       | No       | auto-detected    | GitHub host (for Enterprise)                |
| `--release`           | No       | -                | Use GitHub Releases API (no browser needed) |
| `--release-tag <tag>` | No       | gh-attach-assets | Release tag for uploads                     |
| `--browser`           | No       | -                | Force browser mode (skip direct upload)     |
| `--headed`            | No       | -                | Show browser window                         |

## Upload modes

### Browser mode (default)

1. Create a comment with placeholder(s)
2. Open GitHub in browser via playwright-cli
3. Upload image(s) using GitHub's native upload UI
4. Extract the uploaded URL(s)
5. Update the comment with `<img>` tags

### Release mode (`--release`)

1. Create a comment with placeholder(s)
2. Upload image(s) to a GitHub Release via `gh release upload`
3. Update the comment with release download URLs

### Direct mode (auto-detected)

1. Create a comment with placeholder(s)
2. Open GitHub in browser via playwright-cli (for authentication)
3. Trigger the file-attachment component to obtain upload policies
4. Upload file(s) via curl to the media server
5. Update the comment with `user-attachments` URLs

Direct mode is auto-enabled for hosts listed in `~/.config/gh-attach/config`:

```
direct_hosts=host1.example.com,host2.example.com
```

## Notes

- PR comments use the same API as issue comments (use PR number)
- Images are inserted as HTML: `<img src="..." width="800" alt="...">`
- Browser session is persisted, so login is only needed once
- Use `--headed` to debug or when login is required
