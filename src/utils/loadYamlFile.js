const yaml = require('js-yaml')
const fs = require('fs')

/**
 * Loads a YAML file from the local filesystem, and returns it as a JS object.
 * @param  {String}		yamlPath The path to the file, starting from the project root.
 * @return {Promise}	A promise resolving to the JS representation of the file's content.
 */
module.exports = async (yamlPath) => {
	return yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'))
}
