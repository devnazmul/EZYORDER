---
trigger: always_on
---

# Git & Commit Standards

When generating commit messages for the USER, strictly adhere to the project's `commitlint` conventions:

## 1. Commit Message Format
`<type>(<scope>): <subject>`

## 2. Required Scope
A scope **MUST** always be provided (the `scope-empty` rule is set to `never`).

**Valid Scopes:**
- **Features**: Use the exact folder name from `src/features/` (e.g., `auth`, `order`, `dashboard`, `driver`, `expenses`, `menu`, `notifications`, `restaurants`, etc.)
- **Global**: `app`, `api`, `config`, `deps`, `assets`, `core`, `shared`, `owner`

## 3. Header Length Limit
The header (the first line of the commit) **MUST NOT** exceed 100 characters. Keep it concise.

## 4. Body for Details
If a commit requires more explanation, put it in the commit body (using `-m "header" -m "body"` or a new line) rather than cramming it into the header.

## 5. Types
Use standard conventional types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `perf`, `build`, `ci`, `revert`.
