const path = require('path')

const { step } = require('../logger')
const copyDirectory = require('../utils/copyDirectory')
const removeDirectory = require('../utils/removeDirectory')

/**
 * Copies source images into the theme output directory.
 * @param root0
 * @param root0.themeImagesPath
 * @param root0.themeOutputPath
 * @returns {Promise} Nothing.
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
