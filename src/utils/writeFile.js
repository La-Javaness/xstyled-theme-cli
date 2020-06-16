const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const { log } = require('../logger')

module.exports = async (content, outputPath, { execute = false, overwrite = false } = {}, variables = {}) => {
	mkdirp.sync(path.dirname(outputPath))

	if (overwrite && fs.existsSync(outputPath)) {
		log('dim', `Path ${outputPath} already exists and will be overwritten.\n`)
	}

	const fd = fs.openSync(outputPath, overwrite ? 'w' : 'wx', execute ? 0o766 : 0o666)
	fs.writeSync(fd, content)

	return true
}
