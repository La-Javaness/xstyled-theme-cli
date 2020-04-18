const path = require('path')

const { step } = require('../logger')
const loadYamlFile = require('../utils/loadYamlFile')

const { generateEnumFromArray } = require('./typescript')

/**
 * Loads elements of the theme from a variety of YAML sources, exposes them into
 * the theme structure, and builds the corresponding TS definition files.
 * @return {Promise} nothing
 */
const buildConstants = async (dirs) => {
	const { themeSrcPath } = dirs

	step.start('Loading theme constants')
	const constants = await loadYamlFile(path.join(themeSrcPath, 'constants.yml'))
	global.ljnTheme = { ...global.ljnTheme, ...constants }
	step.end()

	generateEnumFromArray(dirs, 'breakpoints.ts', 'Breakpoints', Object.keys(constants.breakpoints))
	generateEnumFromArray(dirs, 'spaces.ts', 'Spaces', Object.keys(constants.spaces))
	generateEnumFromArray(dirs, 'sizes.ts', 'Sizes', Object.keys(constants.sizes))
	generateEnumFromArray(dirs, 'radii.ts', 'Radii', Object.keys(constants.radii))
	generateEnumFromArray(dirs, 'opacities.ts', 'Opacities', Object.keys(constants.opacities))

	step.start('Loading theme abstracts')
	const abstracts = await loadYamlFile(path.join(themeSrcPath, 'abstracts.yml'))
	global.ljnTheme = { ...global.ljnTheme, ...abstracts }
	step.end()

	generateEnumFromArray(dirs, 'borders.ts', 'Borders', Object.keys(abstracts.borders))
}

module.exports = {
	buildConstants,
}
