const { log } = require('../logger')

const { buildColors, exportColorTypescript } = require('./color')
const { buildConstants } = require('./constants')
const { buildIcons } = require('./icons')
const { buildFonts } = require('./fonts')
const { createThemeJS, createOnBackground } = require('./theme')
const { buildTypography } = require('./typography')

module.exports = async (dirs) => {
	global.ljnTheme = {}

	log('header', 'Loading and parsing theme source')

	// DO NOT EDIT THIS ORDER.
	await buildColors(dirs)
	await buildIcons(dirs)
	await buildFonts(dirs)
	await buildConstants(dirs)
	await buildTypography(dirs)

	log('header', 'Writing compiled TypeScript enums and Xstyled themes')
	await exportColorTypescript(dirs)
	await createThemeJS(dirs)
	await createOnBackground(dirs)

	log('success', '\nDone!\n')

	// TODO: Parse component definitions
}
