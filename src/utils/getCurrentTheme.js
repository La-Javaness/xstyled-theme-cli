const path = require('path')

/**
 * Returns the name of the current theme for a given project, if any.
 * @param {object} dirs The resolved directories for this run of the CLI, including `rootPath`.
 * @param dirs.rootPath
 * @returns {?string} The name of the current theme, or null if none is in use.
 */
module.exports = ({ rootPath }) => {
	try {
		return require(path.join(rootPath, 'xstyledTheme.config.js'))
	} catch (e) {
		return null
	}
}
