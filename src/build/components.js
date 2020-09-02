const fs = require('fs')
const { startCase } = require('lodash')
// const { omit, startCase } = require('lodash')
const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')
// const { error, step } = require('../logger')
// const { componentFileSchema } = require('../schemas')
// const loadYamlFile = require('../utils/loadYamlFile')
const readDir = require('../utils/readDir')

// const { generateEnumFromObject } = require('./typescript')

/**
 * Generates a CSS-in-JS styles file that contains the theme for one component,
 * as well as its variants, and a function that returns a styled instance which
 * injects the theme variables into its passed components' props.
 * @param   {object}  dirs          Input and output directories.
 * @param   {string}  filename      Name of the style file to generate.
 * @param   {string}  componentName Name of the component for which the file is being generated.
 * @param   {object}  component     Extracted theme data for the component.
 * @returns {Promise} Nothing.
 */
// const generateCssInJSFromYaml = async (dirs, filename, componentName, component) => {
// 	const { themeOutputPath } = dirs
//
// 	step.start(`Generating CSS-in-JS file for component '${componentName}'`)
// 	const contents = `const genStyledFunctionFactory = require('@xstyled-theme/internals')
//
// const themeVars = ${JSON.stringify(component.core, null, '\t')}
//
// const themeVariants = ${JSON.stringify(component.variants, null, '\t')}
//
// module.exports = (componentStyleApi, scStyled = null) => genStyledFunctionFactory(themeVars, themeVariants)(componentStyleApi, scStyled)
//
// module.exports.themeVars = themeVars
// module.exports.themeVariants = themeVariants
// `
//
// 	const destDir = path.join(themeOutputPath, 'components')
// 	mkdirp.sync(destDir)
// 	fs.writeFileSync(path.join(destDir, filename), contents)
// 	step.end()
// }

/**
 * Outputs a CSS-in-JS styles file that contains xstyled code blocks for various
 * sections of a component, ready to be injected into the component.
 * @param   {object}  dirs          Input and output directories.
 * @param   {string}  filename      Name of the style file to generate.
 * @param   {string}  input         Name of input file for the component.
 * @param   {string}  componentName Name of the component for which the file is being generated.
 * @returns {Promise} Nothing.
 */
const copyCssInJsFile = async (dirs, filename, input, componentName) => {
	const { themeOutputPath } = dirs

	step.start(`Copying CSS-in-JS file for component '${componentName}'`)
	const destDir = path.join(themeOutputPath, 'components')
	mkdirp.sync(destDir)
	fs.copyFileSync(input, path.join(destDir, filename))
	step.end()
}

/**
 * Loads component variants and theme values from YAML files in the components folder/.
 * @param   {object}  dirs Input and output directories.
 * @returns {Promise} Nothing.
 */
const buildComponents = async (dirs) => {
	const { themeSrcPath } = dirs

	step.start('Loading component definitions')
	const componentDirPath = path.join(themeSrcPath, 'components')
	const inputFiles = await readDir(componentDirPath)

	/* YAML VERSION */
	// const componentFiles = inputFiles.filter((fullPath) => fullPath.endsWith('.yml'))
	// global.ljnTheme.components = {}
	//
	// for (const componentFile of componentFiles) {
	// 	const componentYamlPath = path.join(componentDirPath, componentFile)
	//
	// 	// async because of I/O interrupts on the same disk, so we don't care about the loss of parallelism.
	// 	const component = await loadYamlFile(componentYamlPath) // eslint-disable-line no-await-in-loop
	//
	// 	const validation = componentFileSchema.validate(component)
	// 	if (validation.error) {
	// 		error(`Validation error on file '${componentYamlPath}': ${validation.error}`)
	// 	}
	//
	// 	const componentName = startCase(componentFile.substring(0, componentFile.length - 4))
	// 	global.ljnTheme.components[componentName] = {
	// 		core: component.core,
	// 		variants: Object.keys(component)
	// 			.filter((key) => key !== 'core')
	// 			.map((key) => ({
	// 				prop: key.substring(0, key.length - 1),
	// 				default: component[key].default,
	// 				variants: omit(component[key], 'default'),
	// 			})),
	// 	}
	// }
	//
	// step.end()
	//
	// for (const [componentName, component] of Object.entries(global.ljnTheme.components)) {
	// 	for (const variant of component.variants) {
	// 		const enumName = `${componentName}${startCase(variant.prop)}s`
	// 		generateEnumFromObject(dirs, `${enumName}.ts`, enumName, variant.variants, variant.default)
	// 	}
	// 	generateCssInJSFromYaml(dirs, `${componentName}.style.js`, componentName, component)
	// }
	/* END YAML VERSION */

	/* JS VERSION */
	const componentFiles = inputFiles.filter((fullPath) => fullPath.endsWith('.js'))
	step.end()

	for (const componentFile of componentFiles) {
		const componentJSPath = path.join(componentDirPath, componentFile)
		const componentName = startCase(componentFile.substring(0, componentFile.length - 3))

		copyCssInJsFile(dirs, `${componentName}.style.js`, componentJSPath, componentName)
	}
	/* END JS VERSION */
}

module.exports = {
	buildComponents,
}
