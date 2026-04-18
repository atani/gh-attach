# gh-attach

Upload images to GitHub Issue/PR comments (or just get back the asset URL).
Works on **GitHub.com** and **GitHub Enterprise Server** (React-based issue pages).

## Why this exists

GitHub does not expose a public API for uploading images as
`user-attachments/assets/<uuid>` — the format you get from drag-and-drop in the
web UI. `gh api` alone cannot do it. `gh-attach` drives a real browser via
[playwright-cli](https://www.npmjs.com/package/@playwright/cli) so you get the
exact same URL format that a human would.

The common pain points `gh-attach` solves:

- **SSO / SAML re-auth every few minutes.** With `--session NAME --keep-session`,
  gh-attach reuses a persistent playwright-cli session. One interactive login
  in the morning, rest of the day is free.
- **GHE React pages.** Modern GHE replaces the classic `file-attachment`
  custom element with a React implementation. gh-attach's Browser mode
  reads the upload URL from `textarea.value` so it works on both classic
  and React-based pages.
- **Scriptable URL-only mode.** `--url-only` prints the uploaded asset URLs
  to stdout (one per line) and skips comment creation entirely, so you can
  pipe them into `gh pr review --comment --body-file` or any other flow.

## Install

### gh extension (recommended)

```bash
gh extension install atani/gh-attach

# Use as: gh attach
gh attach --issue 123 --image ./screenshot.png
```

### Homebrew

```bash
brew tap atani/tap     # first time only
brew install gh-attach
```

### Manual

```bash
npm install -g @playwright/cli   # provides the playwright-cli binary
git clone https://github.com/atani/gh-attach.git
# Put the script on your PATH. Adjust the target if ~/.local/bin is not on PATH.
mkdir -p ~/.local/bin
ln -s "$PWD/gh-attach/bin/gh-attach" ~/.local/bin/gh-attach
```

## Requirements

- [gh CLI](https://cli.github.com/) authenticated (`gh auth login`)
- [playwright-cli](https://www.npmjs.com/package/@playwright/cli) for Browser and Direct modes
- [jq](https://jqlang.github.io/jq/) for Direct mode

## Quick start

### GitHub.com

```bash
gh attach --issue 123 --image ./screenshot.png
```

First run opens a browser window; log in to GitHub, then the session is reused.

### GitHub Enterprise behind SAML (the main use case)

Once per laptop, log in through a named persistent session:

```bash
playwright-cli --session ghe open --persistent https://ghe.example.com
# → complete SAML in the browser, check "Trust this device" if offered
```

Then upload without re-authenticating for the rest of the day:

```bash
gh attach \
  --host ghe.example.com --repo owner/repo --issue 123 \
  --session ghe --keep-session --browser \
  --image ./screenshot.png
```

Or print only the URL and post the comment yourself:

```bash
url=$(gh attach \
  --host ghe.example.com --repo owner/repo --issue 123 \
  --session ghe --keep-session --browser --url-only \
  --image ./screenshot.png)

echo "Result: <img src=\"$url\" width=\"800\">" \
  | gh pr review 123 --repo ghe.example.com/owner/repo --comment --body-file -
```

> **Note:** `--browser` is currently required on GHE. The Direct mode depends
> on the classic `file-attachment` custom element, which GHE's React UI does
> not expose. Browser mode works on both.

## Options

| Option                | Description                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `--issue <number>`    | Issue or PR number (required)                                                                                                              |
| `--image <path>`      | Image file (can be repeated)                                                                                                               |
| `--repo <owner/repo>` | Target repository (default: current repo)                                                                                                  |
| `--host <host>`       | GitHub host (auto-detected)                                                                                                                |
| `--width <px>`        | Image width in `<img>` tag (default: 800)                                                                                                  |
| `--body <text>`       | Comment body text (supports placeholders, see below)                                                                                       |
| `--body-file <path>`  | Read body from file                                                                                                                        |
| `--release`           | Use GitHub Releases API (no browser needed)                                                                                                |
| `--release-tag <tag>` | Release tag for `--release` (default: `gh-attach-assets`)                                                                                  |
| `--browser`           | Force Browser mode (skip Direct mode)                                                                                                      |
| `--headed`            | Show browser window (useful for first login / debugging)                                                                                   |
| `--session <name>`    | playwright-cli session name to reuse. Combine with `--keep-session` and a one-time `playwright-cli --session NAME open --persistent URL`.  |
| `--keep-session`      | Do not stop the browser on exit. Preserves session-only cookies and "remember this device" state across invocations.                       |
| `--url-only`          | Print uploaded asset URLs to stdout (one per line) and skip comment creation/update entirely. `--issue` is still required as page context. |

## Placeholders

Control where images appear in the comment body.

| Placeholder                  | Meaning                       |
| ---------------------------- | ----------------------------- |
| `<!-- gh-attach:IMAGE -->`   | Single image (or first image) |
| `<!-- gh-attach:IMAGE:1 -->` | First image (numbered)        |
| `<!-- gh-attach:IMAGE:N -->` | N-th image                    |

If no placeholder is present, images are appended to the end of the body.

## Upload modes

### Browser mode (default; required for GHE)

1. Create a comment with placeholders (skipped when `--url-only`)
2. Open the Issue/PR page via playwright-cli
3. Click the native "Paste, drop, or click to add files" button
4. Upload the image; read the resulting URL from the comment textarea
5. Either update the placeholder comment with `<img>` tags, or (with
   `--url-only`) print the URL to stdout and exit without touching
   comments

### Release mode (`--release`)

Uploads are stored on a tagged Release in the repo. No browser needed, but the
URL format is `releases/download/...` (not `user-attachments/assets/...`).

### Direct mode (opt-in per host)

Once playwright-cli has the upload policy from the `file-attachment`
custom element, the actual upload goes over `curl` — faster than
scripting the full browser click/upload dance. Direct mode is the
historical github.com path (use at your own discretion; test with
`--browser` available as a fallback). Current GitHub Enterprise does
**not** work in Direct mode because GHE's React UI does not render
the `file-attachment` element.

Enable Direct mode by listing hosts in `~/.config/gh-attach/config`:

```ini
# Direct mode is auto-selected for these hosts.
# Leave the list empty or omit the file for Browser mode only.
direct_hosts=github.com
```

## Troubleshooting

- **SAML prompt every few hours.** The browser was torn down between
  invocations. Run gh-attach with `--session NAME --keep-session`.
- **`File access denied` / `ENOENT`.** Put all images under the same
  directory; gh-attach cd's into the first image's parent so the
  playwright daemon sees them.
- **`Failed to get upload policy` on GHE.** Direct mode is not supported
  on GHE yet. Add `--browser` to force Browser mode (or remove the host
  from `direct_hosts`).
- **`Timeout waiting for GitHub page`.** SAML session expired. Re-run
  `playwright-cli --session NAME open --persistent URL` and complete the
  login flow.
