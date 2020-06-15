const { log } = require('../logger')

const { buildComponents } = require('./components')
const { buildColors, exportColorTypescript } = require('./color')
const { buildConstants } = require('./constants')
const { buildFonts } = require('./fonts')
const { buildIcons } = require('./icons')
const { buildImages } = require('./images')
const { createThemeJS, createOnBackground } = require('./theme')
// const { transpileTS } = require('./typescript')
const { buildTypography } = require('./typography')

module.exports = async (dirs) => {
	global.ljnTheme = {}

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

	// FIXME: disabled because we end up having .ts/.js files with the same name,
	// causing confusion to loaders in libraries using our themes. TS only for now.
	// log('header', 'Transpiling TypeScript to JavaScript')
	// await transpileTS(dirs)

	log('success', '\nDone!\n')

	// TODO: Parse component definitions
}
