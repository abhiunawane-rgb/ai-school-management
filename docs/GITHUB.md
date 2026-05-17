# GitHub repositories

This project lives in its **own** repository. It is not mixed with the older School Management codebase.

| Repository | Purpose |
|------------|---------|
| [abhiunawane-rgb/ai-school-management](https://github.com/abhiunawane-rgb/ai-school-management) | **This project** — AI School Management monorepo |
| [abhiunawane-rgb/school-management](https://github.com/abhiunawane-rgb/school-management) | **Separate** — legacy Flutter/Expo school app (do not push this monorepo there) |

## Clone

```bash
git clone https://github.com/abhiunawane-rgb/ai-school-management.git
cd ai-school-management
pnpm install
```

## Push (maintainers)

```bash
git remote -v
# origin → ai-school-management
# school-management → old repo (optional, for reference only)

git push -u origin main
```

## First-time setup on GitHub

If the `ai-school-management` repo does not exist yet:

1. Open https://github.com/new
2. Repository name: `ai-school-management`
3. **Do not** initialize with README, .gitignore, or license (this repo already has them)
4. Create repository, then from your machine:

```bash
cd "E:\My Cursor Projects\AI School Management"
git push -u origin main
```

## Clean up old remote branch (optional)

On `school-management`, the branch `ai-school-monorepo` was used during development. You can delete it on GitHub so only the legacy project remains on that repo:

**Settings → Branches** or: `git push school-management --delete ai-school-monorepo`
