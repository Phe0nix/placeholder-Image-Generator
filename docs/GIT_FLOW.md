# Git Flow Guide

This project uses a lightweight Git Flow model.

## Long-lived branches
- `master`: production-ready code.
- `develop`: integration branch for upcoming release.

## Supporting branches
- `feature/<name>`: new features, branch from `develop`, merge into `develop`.
- `bugfix/<name>`: non-critical fixes, branch from `develop`, merge into `develop`.
- `chore/<name>`: maintenance tasks, branch from `develop`, merge into `develop`.
- `docs/<name>`: documentation updates, branch from `develop`, merge into `develop`.
- `test/<name>`: tests or test tooling, branch from `develop`, merge into `develop`.
- `release/<version>`: release prep, branch from `develop`, merge into `master` and back into `develop`.
- `hotfix/<name>`: urgent production fixes, branch from `master`, merge into `master` and back into `develop`.

## One-time setup

Create and publish `develop`:

```bash
git checkout master
git pull origin master
git checkout -b develop
git push -u origin develop
```

## Daily workflow

Start a feature:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/short-description
```

Finish a feature:

```bash
git checkout develop
git pull origin develop
git merge --no-ff feature/short-description
git push origin develop
```

## Release workflow

Create release branch:

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

Finalize release:

```bash
git checkout master
git merge --no-ff release/v1.2.0
git tag v1.2.0
git push origin master --tags

git checkout develop
git merge --no-ff release/v1.2.0
git push origin develop
```

## Hotfix workflow

Create hotfix branch:

```bash
git checkout master
git pull origin master
git checkout -b hotfix/issue-short-name
```

Finalize hotfix:

```bash
git checkout master
git merge --no-ff hotfix/issue-short-name
git push origin master

git checkout develop
git merge --no-ff hotfix/issue-short-name
git push origin develop
```

## Automation
- PR branch rules are validated by `.github/workflows/gitflow-branch-guard.yml`.
- PR template enforces branch and checklist hygiene.
