module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // Disabling React import as we are using React 18
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    // Enforces arrow functions when defining React function components.
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],

    // Enforce default arguments for optional props.
    'react/require-default-props': ['error', { functions: 'defaultArguments' }],

    // Changed ESLint 'no-shadow' to 'typescript-eslint/no-shadow' to avoid false positives with enums.
    // https://github.com/typescript-eslint/typescript-eslint/issues/2483#issuecomment-687095358
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    // No spreading off so ...rest props can be passed through components
    'react/jsx-props-no-spreading': 'off',

    // Disabled some accessibility rules
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',

    // Fix error by setting the htmlFor attribute on the label.
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
  },
  overrides: [
    // Avoid require checking in the server side.
    {
      files: ['server/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    // Allow param-reassign for Redux state
    {
      files: ['src/redux/**/*Slice.ts'],
      rules: { 'no-param-reassign': ['error', { props: false }] },
    },
  ],
};
