module.exports = {
	settings: {
		react: {
			version: '999.999.999',
		},
	},
	extends: ['plugin:react/recommended', 'react-app', 'plugin:prettier/recommended', 'prettier/react'],
	rules: {
		'import/no-named-as-default': 0,
		'import/no-named-as-default-member': 0,
    'no-console': [1, { 'allow': ['error', 'info'] }],
	},
}
