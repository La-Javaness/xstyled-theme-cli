const eslintBase = require('./.dotfiles/eslint')

module.exports = {
  ...eslintBase,
	rules: {
    ...eslintBase.rules,
		'no-restricted-syntax': 0,
  }
}
