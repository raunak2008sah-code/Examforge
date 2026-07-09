// commitlint configuration — enforces CLAUDE.md §5.2 commit message format.
//
// Format:  <type>(<scope>): <imperative summary>
// Example: feat(auth): add requireRole middleware
//
// Types:   feat, fix, refactor, perf, security, docs, test, chore, build
// Scopes:  auth, exams, questions, attempts, parser, ocr, ui, db, infra

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow the types defined in CLAUDE.md §5.2
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'security', 'docs', 'test', 'chore', 'build', 'revert'],
    ],
    // Allow the scopes defined in CLAUDE.md §5.2
    'scope-enum': [
      1, // warn only — scope list will grow; we don't want to block valid commits
      'always',
      ['auth', 'exams', 'questions', 'attempts', 'parser', 'ocr', 'ui', 'db', 'infra', 'deps', 'config'],
    ],
    // Subject must be lowercase imperative (no period at end)
    'subject-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    // Keep subject concise
    'header-max-length': [2, 'always', 100],
    // Body/footer are optional — no rules enforced on them
    'body-max-line-length': [1, 'always', 120],
  },
};
