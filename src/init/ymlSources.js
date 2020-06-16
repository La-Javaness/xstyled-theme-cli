const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')
const copyFile = require('../utils/copyFile')

module.exports = async (dirs, opts) => {
	step.start('Initialising the source directory with templates')
	const { themeSrcPath } = dirs

	mkdirp.sync(themeSrcPath)
	for (const template of ['abstracts', 'colors', 'constants', 'typography']) {
		copyFile(path.join(__dirname, `../../templates/${template}.yml`), path.join(themeSrcPath, `${template}.yml`))
	}
	step.end()
}
