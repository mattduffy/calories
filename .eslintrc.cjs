const restrictedGlobals = require('eslint-restricted-globals')

module.exports = {
  settings: {
    'import/resolver': {
      exports: {},
      node: {
        extensions: ['.js', '.mjs'],
      },
    },
  },
  globals: {
    window: true,
    document: true,
    origin: true,
    worker: true,
  },
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  plugins: [
  ],
  extends: 'airbnb-base',
  overrides: [
    {
      files: ['public/j/worker.js'],
      rules: {
        'no-restricted-globals': ['error', 'isFinite', 'isNaN'].concat(restrictedGlobals),
      },
    },
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ['@babel/plugin-syntax-import-assertions'],
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'never'],
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 100 }],
    'new-cap': 'off',
    camelcase: ['error', {
      allow: ['walk_1', 'walk_2', 'walk_3', 'walk_4', 'walk_5', 'cals_1', 'cals_2'],
    }],
  },
}
