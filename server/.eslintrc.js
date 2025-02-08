module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended' // Используй это для интеграции Prettier
		// 'prettier/@typescript-eslint', // Отключает конфликтующие правила ESLint
	],
	root: true,
	env: {
		node: true,
		jest: true
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': 'error', // Подсвечивает ошибки форматирования от Prettier
		'max-len': ['error', { code: 120 }], // Максимальная длина строки
		'semi': ['error', 'never'], // Ошибка если есть точки с запятой
		'@typescript-eslint/no-unused-vars': 'error', // Ошибка для неиспользуемых переменных
		'@typescript-eslint/no-explicit-any': 'error', // Ошибка для использования any
		// "@typescript-eslint/quotes": [
		//   "error",
		//   "single",
		//   {
		//     "avoidEscape": true,
		//     "allowTemplateLiterals": true
		//   }
		// ], // Использование одинарных кавычек
		"no-trailing-spaces": [2, { "skipBlankLines": false }], // Удалять пробелы в конце строк
		// 'no-trailing-spaces': ['error', { skipBlankLines: false }], // Удалять пробелы в конце строк
		'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1 }], // Максимум одна пустая строка
		// 'eol-last': ['error', 'never'], // Не добавлять пустую строку в конце файла
		'object-curly-spacing': ['error', 'always'], // Пробелы внутри фигурных скобок
		'comma-spacing': [2, { before: false, after: true }], // Пробелы вокруг запятых
		'arrow-spacing': ['error', { before: true, after: true }], // Пробелы вокруг стрелочных функций
		'space-infix-ops': ['error', { int32Hint: false }], // Пробелы вокруг операторов
		'keyword-spacing': [2, { before: true, after: true }], // Пробелы вокруг ключевых слов
		'arrow-body-style': ['error', 'as-needed'], // Краткие тела стрелочных функций
		'padded-blocks': ['error', 'never'], // Запрещает отступы внутри блоков
		'indent': ['error', 'tab'] // Указывает размер отступа
	}
}
