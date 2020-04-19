const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const { log, error } = require('../logger')
const writeFile = require('./writeFile')

module.exports = async ({ rootDir }) => {
	const packagePath = path.join(rootDir, 'package.json')
	if (!fs.existsSync(packagePath)) {
		if (process.env.SCRIPT_ENV === 'local') {
			log('dim', 'Creating fake package.json in temp folder to test the CLI.')
			await writeFile('{"name": "dev-project"}', packagePath)
			return true
		}
		error(
			`Could not find package.json, please run the following command first:\n\n${chalk.reset('$ yarn init ')}\n`
		)
		return false
	}
	return true
}
