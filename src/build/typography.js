const { forEach, camelCase, startCase, omit } = require('lodash')
const path = require('path')

const { error, step } = require('../logger')
const { typographyFileSchema } = require('../schemas')
const loadYamlFile = require('../utils/loadYamlFile')

const { generateEnumFromObject } = require('./typescript')

/**
 * Loads icons from the assets directory, optimises them, builds SVG sprites and
 * React components out of the optimised icons, and generates a TS enum for icon names.
 * @param dirs
 * @returns {Promise} Nothing.
 */
const buildTypography = async (dirs) => {
	const { themeSrcPath } = dirs
	step.start('Loading typography definitions')
	const typographyFilePath = path.join(themeSrcPath, 'typography.yml')
	const typographyContents = await loadYamlFile(typographyFilePath)
	const validation = typographyFileSchema.validate(typographyContents)
	if (validation.error) {
		error(`Validation error on file '${typographyFilePath}': ${validation.error}`)
	}
	Object.assign(global.ljnTheme, omit(typographyContents, 'textStyles'))
	step.end()

	// These props will be root elements in the final theme, and all have their own TS file.
	const textStyleToThemePropMap = {
		fontSize: 'fontSizes',
		fontFamily: 'fonts',
		fontWeight: 'fontWeights',
		letterSpacing: 'letterSpacings',
		lineHeight: 'lineHeights',
		textDecoration: 'textDecorations',
		textTransform: 'textTransforms',
	}

	step.start('Parsing text styles')
	Object.values(textStyleToThemePropMap).forEach((themeProp) => {
		global.ljnTheme[themeProp] = global.ljnTheme[themeProp] || {}
	})

	forEach(typographyContents.textStyles, (style, styleName) => {
		forEach(textStyleToThemePropMap, (themeProp, styleProp) => {
			const rawValue = style[styleProp]

			if (rawValue) {
				const resolvedValue = global.ljnTheme[themeProp][rawValue]
				global.ljnTheme[themeProp][`${styleName}Style`] = resolvedValue !== undefined ? resolvedValue : rawValue
			}
		})

		if (style.color) {
			// TODO: if the color resolves as a literal, add it as a themeColor.
			// Else, only as a foreground color
			global.ljnTheme.colors.foregrounds[`${styleName}Style`] = style.color
		}
	})
	step.end()

	Object.values(textStyleToThemePropMap).forEach((themeProp) => {
		generateEnumFromObject(
			dirs,
			`${themeProp}.ts`,
			startCase(camelCase(themeProp)).replace(/ /g, ''),
			global.ljnTheme[themeProp]
		)
	})
}

module.exports = {
	buildTypography,
}
