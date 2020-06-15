const fs = require('fs')
const path = require('path')

const copyDirectory = (source, dest) => {
	const exists = fs.existsSync(source)
	const stats = exists && fs.statSync(source)
	const isDirectory = exists && stats.isDirectory()
	if (isDirectory) {
		fs.mkdirSync(dest)
		fs.readdirSync(source).forEach((child) => {
			copyDirectory(path.join(source, child), path.join(dest, child))
		})
	} else {
		fs.copyFileSync(source, dest)
	}
}

module.exports = copyDirectory
