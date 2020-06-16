const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')
const writeFile = require('../utils/writeFile')

module.exports = async (dirs, opts) => {
	step.start('Initialising the assets directory')
	const { themeFontsPath, themeIconsPath, themeImagesPath } = dirs

	mkdirp.sync(themeFontsPath)
	mkdirp.sync(themeIconsPath)
	mkdirp.sync(themeImagesPath)

	const fontReadme = `Put your source font files here.\n\nSource files should be in the TTF format, and will be compiled into WOFF, WOFF2, EOT and optimised TTF.`
	await writeFile(fontReadme, path.join(themeFontsPath, 'README.md'))
	await writeFile('', path.join(themeFontsPath, '.gitkeep'))

	const iconsReadme = `Put your icons here, as SVG files with a single layer and a transparent background.\n\nYou don't need to optimise the icons, it will be done automatically.\n\nIcons will be turned into SVG sprites and React components.`
	await writeFile(iconsReadme, path.join(themeIconsPath, 'README.md'))
	await writeFile('', path.join(themeIconsPath, '.gitkeep'))

	const imageReadme = `Put your theme's static images here. Images are exported, unmodified, into an images folder for your theme to use.`
	await writeFile(imageReadme, path.join(themeImagesPath, 'README.md'))
	await writeFile('', path.join(themeImagesPath, '.gitkeep'))
	step.end()
}
