const fs = require('fs')
const parse = require('parse-git-config')
const path = require('path')

const _getGitUser = (configFile) => {
	const config = parse.sync({ path: configFile })
	if (typeof config === 'object' && config.hasOwnProperty('user')) {
		return `${config.user.name} <${config.user.email}>`
	}
	return null
}

/**
 * Returns the username and email of the local Git user, either from the
 * project's config or their global config, if available.
 * @return {?String} The username in the format 'Full Name <email>', or null if not found.
 */
module.exports = ({ rootPath }) => {
	let gitUser = null
	const rootPathGitConfig = path.join(rootPath, '.git', 'config')

	if (fs.existsSync(rootPathGitConfig)) {
		gitUser = _getGitUser(rootPathGitConfig)
	}

	if (!gitUser) {
		gitUser = _getGitUser(require('git-config-path')('global'))
	}

	return gitUser
}
