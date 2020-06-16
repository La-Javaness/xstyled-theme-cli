const path = require('path')

const { step } = require('../logger')
const copyDirectory = require('../utils/copyDirectory')
const removeDirectory = require('../utils/removeDirectory')

/**
 * Copies source images into the theme output directory.
 * @return {Promise} nothing
 */
const buildImages = async function ({ themeImagesPath, themeOutputPath }) {
	step.start('Copying images into theme')
	const outputPath = path.join(themeOutputPath, 'images')
	await removeDirectory(outputPath)
	await copyDirectory(themeImagesPath, outputPath)
	step.end()
}

module.exports = {
	buildImages,
}
