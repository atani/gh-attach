# gh-attach

Upload an image to a GitHub Issue/PR comment and insert it with a fixed width.

This tool uses the GitHub API via the `gh` CLI. It works for both GitHub.com and GitHub Enterprise.

## Install

Add the `bin` directory to your PATH, or symlink the script:

```bash
ln -s /Users/akira/src/github.com/atani/gh-attach/bin/gh-attach /usr/local/bin/gh-attach
```

## Usage

```bash
gh-attach --issue 123 --image ./e2e.png --width 500 --body-file report.md
```

Options:

- `--repo owner/repo` (default: current repo)
- `--issue number` (required)
- `--image path` (required)
- `--width px` (default: 500)
- `--body text`
- `--body-file path`
- `--alt text` (default: filename)
- `--host host` (auto-detected)
- `--uploads-host host` (default: `uploads.<host>`)

## Notes

- PR comments are treated as issue comments, so use the PR number.
- The image is inserted as HTML: `<img src="..." width="500" alt="...">`.
