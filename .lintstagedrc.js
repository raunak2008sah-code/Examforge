const path = require('path');

const buildEslintCommand = (filenames) =>
  `pnpm --filter @examforge/web exec next lint --fix ${filenames
    .map((f) => '--file ' + f)
    .join(' ')}`;

module.exports = {
  'apps/web/**/*.{ts,tsx}': [
    buildEslintCommand,
    'prettier --write'
  ],
  'packages/**/*.ts': [
    'prettier --write'
  ],
  'apps/doc-processor/**/*.py': [
    'ruff check --fix',
    'ruff format'
  ],
  'prisma/schema.prisma': [
    'pnpm --filter @examforge/db exec prisma format'
  ],
  '*.{json,yaml,yml,md}': [
    'prettier --write'
  ]
};
