const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')
const copyFile = require('../utils/copyFile')
const writeFile = require('../utils/writeFile')

module.exports = async (dirs, opts) => {
	step.start('Initialising the components directory')
	const { themeSrcPath } = dirs

	const componentsPath = path.join(themeSrcPath, 'components')
	mkdirp.sync(componentsPath)

	const readme = `Put your component theme files here.\n\nA sample component is provided. Refer to the theme API of the UI toolkit or app for which your theme is designed to know which components and variables should be declared.`
	await writeFile(readme, path.join(componentsPath, 'README.md'))
	await writeFile('', path.join(componentsPath, '.gitkeep'))
	await copyFile(
		path.join(__dirname, `../../templates/SampleComponent.yml`),
		path.join(componentsPath, `SampleComponent.yml`)
	)
	step.end()
}
