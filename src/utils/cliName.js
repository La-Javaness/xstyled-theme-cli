const packageManifest = require('../../package.json')

/**
 * Returns the name of this CLI, derived from the manifest.
 * @returns {string} The name of this CLI.
 */
module.exports = Object.keys(packageManifest.bin)[0]
