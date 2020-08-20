const fs = require('fs')
const { log, step } = require('../logger')
const getJSFilePaths = require('../utils/getJSFilePaths')

const { transpileJS } = require('./babel')
const { buildComponents } = require('./components')
const { buildColors, exportColorTypescript } = require('./color')
const { buildConstants } = require('./constants')
const { buildFonts } = require('./fonts')
const { buildIcons } = require('./icons')
const { buildImages } = require('./images')
const { createThemeJS, createOnBackground } = require('./theme')
const { transpileTS } = require('./typescript')
const { buildTypography } = require('./typography')

module.exports = async (dirs) => {
	global.ljnTheme = {}

	log('header', 'Cleaning expired build assets, if any')
	step.start('Deleting old code assets')
	if (fs.existsSync(dirs.themeOutputPath)) {
		const oldJSFiles = await getJSFilePaths(dirs, true)
		oldJSFiles.forEach((file) => fs.unlinkSync(file))
	}
	step.end()

	log('header', 'Loading and parsing theme source')
	// DO NOT EDIT THIS ORDER.
	await buildColors(dirs)
	await buildIcons(dirs)
	await buildImages(dirs)
	await buildFonts(dirs)
	await buildConstants(dirs)
	await buildTypography(dirs)

	log('header', 'Loading components')
	await buildComponents(dirs)

	log('header', 'Writing TypeScript enums and Xstyled themes')
	await exportColorTypescript(dirs)
	await createThemeJS(dirs)
	await createOnBackground(dirs)

	log('header', 'Transpiling Code')
	await transpileTS(dirs)
	// await transpileJS(dirs)

	log('success', '\nDone!\n')
}
