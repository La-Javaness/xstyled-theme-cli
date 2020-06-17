const path = require('path')

/**
 * Returns the name of the current theme for a given project, if any.
 * @param {Object} dirs The resolved directories for this run of the CLI, including `rootPath`.
 * @return {?String} The name of the current theme, or null if none is in use.
 */
module.exports = ({ rootPath }) => {
	try {
		return require(path.join(rootPath, 'xstyledTheme.config.js'))
	} catch (e) {
		return null
	}
}
