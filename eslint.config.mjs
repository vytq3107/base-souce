import nx from '@nx/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';

const error = 'error';
const warn = 'warn';
const off = 'off';

const folders = [
  { name: 'entities', suffix: 'entity' },
  { name: 'utils', suffix: 'util' },
  { name: 'constants', suffix: 'constant' },
  { name: 'dto', suffix: 'dto' },
  { name: 'enums', suffix: 'enum' },
  { name: 'interfaces', suffix: 'interface' },
  { name: 'types', suffix: 'type' },
  { name: 'seeds', suffix: 'seed' },
  { name: 'guards', suffix: 'guard' },
  { name: 'strategies', suffix: 'strategy' },
  { name: 'services', suffix: 'service' },
  { name: 'clients', suffix: 'client' },
  { name: 'classes', suffix: 'class' },
  { name: 'decorators', suffix: 'decorator' },
  { name: 'filters', suffix: 'filter' },
  { name: 'interceptors', suffix: 'interceptor' },
  { name: 'pipes', suffix: 'pipe' },
  { name: 'repositories', suffix: 'repository' },
  { name: 'validators', suffix: 'validator' },
  { name: 'configs', suffix: 'config' },
  { name: 'schemas', suffix: 'schema' },
  { name: 'commands', suffix: 'command' },
  { name: 'providers', suffix: 'provider' },
  { name: 'helpers', suffix: 'helper' },
  { name: 'consumers', suffix: 'consumer' },
  { name: 'producers', suffix: 'producer' },
  { name: 'publishers', suffix: 'publisher' },
  { name: 'middlewares', suffix: 'middleware' }
];

const folderOverrides = folders.map(({ name, suffix }) => {
  const subFolderIgnores = folders
    .filter((f) => f.name !== name)
    .map((f) => `**/${name}/**/${f.name}/**/*.{ts,tsx,js,jsx}`);

  return {
    files: [`**/${name}/**/*.{ts,tsx,js,jsx}`],
    ignores: [
      `**/${name}/**/*.${suffix}.{ts,tsx,js,jsx}`,
      `**/${name}/**/index.{ts,tsx,js,jsx}`,
      `**/${name}/**/*.spec.{ts,tsx,js,jsx}`,
      `**/${name}/**/*.test.{ts,tsx,js,jsx}`,
      ...subFolderIgnores
    ],
    rules: {
      'no-restricted-syntax': [
        error,
        {
          selector: 'Program',
          message: `Files under "${name}/" must end with ".${suffix}.ts/js/jsx/tsx".`
        }
      ]
    }
  };
});

const reservedWords = ['system', 'notification', 'normalize'];
const reservedClassPattern = reservedWords.map((w) => w[0].toUpperCase() + w.slice(1)).join('|');
const reservedFunctionPattern = reservedClassPattern.toLowerCase();

const reservedOverrides = reservedWords.flatMap((word) => {
  const head = `[${word[0].toLowerCase()}${word[0].toUpperCase()}]${word.slice(1)}`;
  return [
    {
      files: [`**/${head}.{ts,tsx,js,jsx}`],
      rules: {
        'no-restricted-syntax': [
          error,
          {
            selector: 'Program',
            message: `Filenames must not be exactly "${word}". That name is reserved.`
          }
        ]
      }
    },
    {
      files: [`**/${head}.*.{ts,tsx,js,jsx}`],
      rules: {
        'no-restricted-syntax': [
          error,
          {
            selector: 'Program',
            message: `Filename starting with "${head}." is reserved. Please rename it.`
          }
        ]
      }
    }
  ];
});

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/{dist,build,.next,.turbo,coverage,.cache,out}/**',
      'apps/**/migrations/**',
      'libs/**/migrations/**',
      '**/*.gen.*',
      '**/*.generated.*',
      '**/jest.config.ts',
      '**/jest.preset.js',
      '**/*.setup.ts',
      '**/*.config.ts',
      '**/*.config.{ts,js,cjs,mjs}',
      '**/webpack.config.ts',
      '**/vite.config.ts'
    ]
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: { '@nx': nx },
    rules: {
      '@nx/enforce-module-boundaries': [
        error,
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      unicorn
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': off,
      '@typescript-eslint/explicit-function-return-type': off,
      '@typescript-eslint/explicit-module-boundary-types': off,
      '@typescript-eslint/no-explicit-any': error,
      '@typescript-eslint/no-unused-vars': warn,
      'prettier/prettier': warn,
      'simple-import-sort/imports': [
        warn,
        {
          groups: [
            ['^node:|^fs$|^path$|^crypto$'],
            ['^@nestjs-modules', '^@nestjs', '^nestjs-i18n', '^date-fns', '^date-fns-tz', '^@?\\w'],
            ['^@support-center(/.*|$)'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^\\u0000']
          ]
        }
      ],
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': warn,
      'unused-imports/no-unused-vars': [
        warn,
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],
      'simple-import-sort/exports': 'off',
      'arrow-body-style': warn,
      'default-case': error,
      'default-case-last': warn,
      'dot-notation': off,
      'no-caller': error,
      'no-console': warn,
      'no-eval': error,
      'no-labels': error,
      'no-octal-escape': error,
      'no-param-reassign': [error, { props: false }],
      'no-promise-executor-return': error,
      'no-self-compare': error,
      'no-shadow': error,
      'no-template-curly-in-string': error,
      'no-unmodified-loop-condition': error,
      'no-unneeded-ternary': warn,
      'no-useless-backreference': error,
      'no-useless-computed-key': warn,
      'no-useless-concat': warn,
      'no-useless-constructor': warn,
      'no-useless-rename': warn,
      'no-var': warn,
      'object-shorthand': warn,
      'one-var': [warn, 'never'],
      'prefer-arrow-callback': warn,
      'prefer-const': warn,
      'prefer-destructuring': [warn, { object: true, array: false }],
      'prefer-exponentiation-operator': warn,
      'prefer-numeric-literals': warn,
      'prefer-object-spread': warn,
      'prefer-promise-reject-errors': error,
      'prefer-regex-literals': warn,
      'prefer-rest-params': warn,
      'prefer-spread': warn,
      curly: warn,
      eqeqeq: [error, 'always', { null: 'ignore' }],
      strict: error,
      yoda: warn,
      'unicorn/filename-case': [
        'error',
        {
          cases: { kebabCase: true },
          ignore: ['^index\\.ts$', '^.+\\.spec\\.ts$']
        }
      ],
      'no-restricted-syntax': [
        error,
        {
          selector: 'SequenceExpression',
          message: 'The comma operator is confusing. Do not use it.'
        },
        {
          selector: "CallExpression[callee.property.name='apply'][arguments.length=2]",
          message: 'Use spread syntax instead of .apply()'
        },
        {
          selector: `ClassDeclaration[id.name=/^(?:${reservedClassPattern})$/]`,
          message: `Class name must not be one of [${reservedWords.map((w) => w[0].toUpperCase() + w.slice(1)).join(', ')}].`
        },
        {
          selector: `FunctionDeclaration[id.name=/^(?:${reservedFunctionPattern})$/]`,
          message: `Function name must not be one of [${reservedWords.map((w) => w[0].toLowerCase() + w.slice(1)).join(', ')}].`
        },
        {
          selector: `VariableDeclarator[id.name=/^(?:${reservedFunctionPattern})$/] > ArrowFunctionExpression`,
          message: `Variable name must not be one of [${reservedWords.map((w) => w[0].toLowerCase() + w.slice(1)).join(', ')}].`
        }
      ],
      '@typescript-eslint/naming-convention': [
        error,
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allowSingleOrDouble',
          filter: { regex: '^NxAppWebpackPlugin$', match: false }
        },
        { selector: 'typeLike', format: ['PascalCase'] }
      ]
    }
  },
  {
    files: ['**/decorators/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        error,
        {
          selector: 'variableLike',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allowSingleOrDouble'
        },
        { selector: 'typeLike', format: ['PascalCase'] }
      ]
    }
  },
  ...folderOverrides,
  ...reservedOverrides
];
