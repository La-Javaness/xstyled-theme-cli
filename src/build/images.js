const path = require('path')

const { step } = require('../logger')
const copyDirectory = require('../utils/copyDirectory')

/**
 * Copies source images into the theme output directory.
 * @return {Promise} nothing
 */
const buildImages = async function ({ themeImagesPath, themeOutputPath }) {
	step.start('Copying images into theme')
	copyDirectory(themeImagesPath, path.join(themeOutputPath, 'images'))
	step.end()
}

module.exports = {
	buildImages,
}
