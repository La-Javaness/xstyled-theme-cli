const fs = require('fs')
const { omit, startCase } = require('lodash')
const mkdirp = require('mkdirp')
const path = require('path')

const { error, step } = require('../logger')
const { componentFileSchema } = require('../schemas')
const loadYamlFile = require('../utils/loadYamlFile')
const readDir = require('../utils/readDir')

const { generateEnumFromObject } = require('./typescript')

/**
 * Generates a CSS-in-JS styles file that contains the theme for one component,
 * as well as its variants, and a function that returns a styled instance which
 * injects the theme variables into its passed components' props.
 * @param {Object} dirs Input and output directories
 * @param  {String}  filename        Name of the style file to generate
 * @param  {[type]}  componentName   Name of the component for which the file is being generated
 * @param  {[type]}  component       Extracted theme data for the component
 * @return {Promise}                 nothing
 */
const generateCssInJS = async (dirs, filename, componentName, component) => {
	const { themeOutputPath } = dirs

	step.start(`Generating CSS-in-JS file for component '${componentName}'`)
	const contents = `const genStyledFunctionFactory = require('@xstyled-theme/utils')

const themeVars = ${JSON.stringify(component.core, null, '\t')}

const themeVariants = ${JSON.stringify(component.variants, null, '\t')}

module.exports = (componentStyleApi, scStyled = null) => genStyledFunctionFactory(themeVars, themeVariants)(componentStyleApi, scStyled)

module.exports.themeVars = themeVars
module.exports.themeVariants = themeVariants
`

	const destDir = path.join(themeOutputPath, 'components')
	mkdirp.sync(destDir)
	fs.writeFileSync(path.join(destDir, filename), contents)
	step.end()
}

/**
 * Loads component variants and theme values from YAML files in the components folder/
 * @param {Object} dirs Input and output directories
 * @return {Promise} nothing
 */
const buildComponents = async (dirs) => {
	const { themeSrcPath } = dirs

	step.start('Loading component definitions')
	const componentDirPath = path.join(themeSrcPath, 'components')
	const inputFiles = await readDir(componentDirPath)
	const componentFiles = inputFiles.filter((fullPath) => fullPath.endsWith('.yml'))
	global.ljnTheme.components = {}

	for (const componentFile of componentFiles) {
		const componentYamlPath = path.join(componentDirPath, componentFile)
		const component = await loadYamlFile(componentYamlPath)

		const validation = componentFileSchema.validate(component)
		if (validation.error) {
			error(`Validation error on file '${componentYamlPath}': ${validation.error}`)
		}

		const componentName = startCase(componentFile.substring(0, componentFile.length - 4))
		global.ljnTheme.components[componentName] = {
			core: component.core,
			variants: Object.keys(component)
				.filter((key) => key !== 'core')
				.map((key) => ({
					prop: key.substring(0, key.length - 1),
					default: component[key].default,
					variants: omit(component[key], 'default'),
				})),
		}
	}
	step.end()

	for (const [componentName, component] of Object.entries(global.ljnTheme.components)) {
		for (const variant of component.variants) {
			const enumName = `${componentName}${startCase(variant.prop)}s`
			generateEnumFromObject(dirs, `${enumName}.ts`, enumName, variant.variants, variant.default)
		}
		generateCssInJS(dirs, `${componentName}.style.js`, componentName, component)
	}
}

module.exports = {
	buildComponents,
}
