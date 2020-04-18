const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const { log } = require('../logger')

module.exports = async (
	content,
	outputPath,
	{ execute = false, overwrite = false, update = false } = {},
	variables = {}
) => {
	mkdirp.sync(path.dirname(outputPath))

	try {
		if (overwrite && !update && fs.existsSync(outputPath)) {
			log('dim', `Path ${outputPath} already exists and will be overwritten.`)
		}

		const fd = fs.openSync(outputPath, overwrite ? 'w' : 'wx', execute ? 0o766 : 0o666)
		fs.writeSync(fd, content)

		log('dim', `${update ? 'Updated' : 'Wrote'} ${outputPath} file.`)
		return true
	} catch (err) {
		if (err.code === 'EEXIST') {
			// only warn about potential overwrites on an install; we expect to have existing config files in an update
			if (!update) {
				log('warning', `File ${outputPath} already exists in the project, and will not be overwritten.`)
			}
			return false
		}

		throw err
	}
}
