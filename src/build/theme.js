const fs = require('fs')
const { camelCase, map, startCase } = require('lodash')
const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')

const { resolveColor } = require('./color')

const makeThemeFile = ({ themeOutputPath }, filename, themeJS, logSuffix = '') => {
	step.start(`Generating xstyled theme file '${filename}'${logSuffix}`)

	const fileContents = `const theme = ${JSON.stringify(themeJS, null, '\t')}

module.exports = theme
`

	const themeDir = path.resolve(themeOutputPath, 'theme')
	mkdirp.sync(themeDir)
	fs.writeFileSync(path.join(themeDir, filename), fileContents)

	step.end()
}

const injectNamedColors = (themeJS) => {
	map(global.ljnTheme.colors.colors, (value, key) => {
		themeJS.colors[key] = resolveColor(value)
	})
}

const injectBackgroundColors = (themeJS) => {
	map(global.ljnTheme.colors.backgrounds, (value, key) => {
		themeJS.colors[`bg-${key}`] = resolveColor(value)
	})
}

// FIXME: not currently supporting deep hierarchies of foregrounds...
const injectForegroundColorsInBackgroundTheme = (themeJS, background) => {
	map(global.ljnTheme.colors.foregrounds, (value, key) => {
		themeJS.colors[key] = resolveColor(typeof value === 'object' ? value[background] || value.default : value)
	})
}

const injectAllForegroundColors = (themeJS) => {
	Object.keys(global.ljnTheme.colors.backgrounds).forEach((background) =>
		map(global.ljnTheme.colors.foregrounds, (value, key) => {
			themeJS.colors[`fg-${key}-on-${background}`] = resolveColor(
				typeof value === 'object' ? value[`on-${background}`] || value.default : value
			)
		})
	)
}

/**
 * Creates the theme.js file to be used by xstyled.
 * @param {object} dirs The directories for this run of the CLI.
 */
const createThemeJS = async (dirs) => {
	step.start('Preparing to generate theme files')
	const themeJS = { ...global.ljnTheme, colors: {} }
	injectNamedColors(themeJS)
	injectBackgroundColors(themeJS)
	injectAllForegroundColors(themeJS)
	step.end()

	makeThemeFile(dirs, 'index.js', themeJS)

	map(global.ljnTheme.colors.backgrounds, (bgValue, bgKey) => {
		const bgThemeJS = { colors: {} }
		injectForegroundColorsInBackgroundTheme(bgThemeJS, `on-${bgKey}`)
		bgThemeJS.colors.background = resolveColor(bgValue)
		makeThemeFile(dirs, `on${startCase(camelCase(bgKey))}.js`, bgThemeJS)
	})
}

/**
 * Creates the OnBackground component with props allowing developers to use a
 * customised theme with typechecking and a clean API.
 * @param   {object}  dirs								 The directories for this run of the CLI.
 * @param   {string}  dirs.themeOutputPath The output path for the theme.
 * @returns {Promise} Nothing.
 * @async
 */
const createOnBackground = async ({ themeOutputPath }) => {
	step.start('Generating the OnBackground component')

	const fileContents = `import React from 'react'
import { ThemeProvider } from '@xstyled/styled-components'

import defaultTheme from './index'
${Object.keys(global.ljnTheme.colors.backgrounds)
	.map((theme) => `import ${theme}Theme from './on${startCase(camelCase(theme))}.js'`)
	.join('\n')}

const backgroundThemes = {
${Object.keys(global.ljnTheme.colors.backgrounds)
	.map((theme) => `	${theme}: ${theme}Theme,`)
	.join('\n')}
}

const OnBackground = ({ background = 'default', children = null }) => {
	let theme = null

	if (background !== 'default') {
		theme = backgroundThemes[background]
	}
	console.log(\`The OnBackground theme is now \${background} aka \${theme}\`)

	return React.createElement(
		ThemeProvider,
		{
	  	theme: theme || defaultTheme
		},
		children
	)
}

export default OnBackground
`

	const themeDir = path.resolve(themeOutputPath, 'theme')
	mkdirp.sync(themeDir)
	fs.writeFileSync(path.join(themeDir, 'OnBackground.jsx'), fileContents)

	step.end()
}

module.exports = {
	createThemeJS,
	createOnBackground,
}
