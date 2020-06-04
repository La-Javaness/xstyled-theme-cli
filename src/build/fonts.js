const fontface = require('fontface-styled-components')
const path = require('path')

const { step } = require('../logger')

/**
 * Uses fontface-styled-components to browse fonts in the assets directory,
 * generate webfonts in necessary formats, and generate CSS-in-JS code blocks
 * for later use.
 * @return {Promise} nothing
 */
const buildFonts = async ({ publicFontsPath, themeFontsPath, themeOutputPath }) => {
	step.start('Generating Fonts')
	await fontface.run({
		sourceDir: themeFontsPath,
		fontsPublicDir: publicFontsPath,
		fontOutputDir: path.join(themeOutputPath, 'fonts'),
		styledOutputDir: path.join(themeOutputPath, 'components', 'fonts'),
		forceRefresh: process.env.NODE_ENV === 'production',
		quiet: !process.env.XSTYLED_THEME_DEBUG,
	})
	step.end()
}

module.exports = {
	buildFonts,
}
