module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
	],
	rules: {
		'no-unused-vars': 'warn',
		'no-console': 'warn',
		'no-undef': 'off', // Desabilitado para TypeScript
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js'],
}; 