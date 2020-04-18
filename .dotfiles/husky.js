module.exports = {
	hooks: {
		'pre-commit': 'yarn test:ci && yarn prettier',
		'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
	},
}
