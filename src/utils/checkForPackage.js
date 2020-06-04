const fs = require('fs')
const path = require('path')

module.exports = async ({ rootDir }) => {
	const packagePath = path.join(rootDir, 'package.json')
	return fs.existsSync(packagePath)
}
