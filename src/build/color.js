const path = require('path')

const { CSS_COLOR_NAMES } = require('../constants')
const { error, step } = require('../logger')
const { colorFileSchema } = require('../schemas')
const loadYamlFile = require('../utils/loadYamlFile')

const { generateEnumFromObject } = require('./typescript')

/**
 * Takes a color name or reference, and returns a valid CSS color code.
 * @param   {string}  colorName  The token to resolve into a valid CSS color code.
 * @param   {string=} state      The name of the surface against which the colour
 * will be displayed.
 * @param   {string=} returnType Either 'resolved' (the default value) or 'origin'.
 * Controls the type of information returned by this resolver.
 * @returns {string}             When `returnType` is 'resolved', the matching
 * CSS color code, if found in the theme. When `returnType` is 'origin', a string
 * that indicates where in the theme the color is defined. This is useful if you
 * need to uniquely distinguish a foreground color based on its background.
 * @throws If the token identified by `colorName` cannot be resolved for the current theme.
 */
const resolveColor = (colorName, state = 'default', returnType = 'resolved') => {
	if (!global.ljnTheme.colors) {
		error('Colors not yet parsed')
	}

	if (typeof colorName !== 'string') {
		error(`Invalid color name type, must be a string, ${typeof colorName} found instead.`)
	}

	// The algorithm finishes when we reach a color declaration literal; either a
	// hex or rgb or rgba code, or a defined CSS color name.
	// ;/rgba?\(\d+, ?\d+, ?\d+, ?(1|0\.\d+)?\)/
	if (colorName.startsWith('rgb') || colorName.startsWith('#') || CSS_COLOR_NAMES.includes(colorName)) {
		return returnType === 'resolved' ? colorName : 'literal'
	}

	if (global.ljnTheme.colors.colors[colorName]) {
		return returnType === 'resolved' ? resolveColor(global.ljnTheme.colors.colors[colorName]) : 'theme-color'
	}

	const splitName = colorName.split('.')
	let leafNode = global.ljnTheme.colors.foregrounds
	for (let index = 0; index < splitName.length; index += 1) {
		leafNode = leafNode[splitName[index]]

		if (leafNode === undefined) {
			const partialMatch = index ? ` Partial match: ${splitName.slice(0, index).join('.')}` : ''
			error(`Unrecognised color name '${colorName}'.${partialMatch}`)
		}
	}

	if (typeof leafNode === 'string') {
		return returnType === 'resolved' ? resolveColor(leafNode) : 'foreground-static'
	}

	if (typeof leafNode === 'object') {
		if (!leafNode[`on-${state}`]) {
			// We might be asking for a state that isn't defined; that's ok, use default state if any.
			if (leafNode.default) {
				return returnType === 'resolved' ? resolveColor(leafNode.default) : 'foreground-default'
			}
			error(`Incomplete color name '${colorName}'. This is the tree matching the color name: ${leafNode}`)
		}

		return returnType === 'resolved' ? resolveColor(leafNode[`on-${state}`]) : `foreground-on-${state}`
	}

	error(`Unrecognised color name '${colorName}'. No match at all.`)
}

/**
 * Loads colors from the `colors.yml` source.
 * @param {object} dirs 						 Input and output directories.
 * @param {string} dirs.themeSrcPath The input folder for the theme YAML files.
 */
const buildColors = async ({ themeSrcPath }) => {
	step.start('Loading color definitions')
	const colorFilePath = path.join(themeSrcPath, 'colors.yml')
	global.ljnTheme.colors = await loadYamlFile(colorFilePath)
	const validation = colorFileSchema.validate(global.ljnTheme.colors)
	if (validation.error) {
		error(`Validation error on file '${colorFilePath}': ${validation.error}`)
	}
	step.end()

	// Color TS definitions are generated later because colors may be added.
}

/**
 * Generates a TS enum for theme colors.
 * @param {object} dirs Input and output directories.
 */
const exportColorTypescript = (dirs) => {
	generateEnumFromObject(dirs, 'colors.ts', 'ThemeColors', global.ljnTheme.colors.colors)
	generateEnumFromObject(dirs, 'backgroundColors.ts', 'BackgroundColors', global.ljnTheme.colors.backgrounds)
	generateEnumFromObject(dirs, 'foregroundColors.ts', 'ForegroundColors', global.ljnTheme.colors.foregrounds)
}

module.exports = {
	resolveColor,
	buildColors,
	exportColorTypescript,
}
