const fs = require('fs')
const { camelCase, map, startCase } = require('lodash')
const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')

const { resolveColor } = require('./color')

const makeThemeFile = ({ themeOutputPath }, filename, themeJS, logSuffix = '') => {
	step.start(`Generating xstyled theme file '${filename}'${logSuffix}`)

	const fileContents = `const theme = ${JSON.stringify(themeJS, null, '\t')}

theme.transformers = {
	space: (value) => value in theme.spaces? theme.spaces[value] : value,
}

module.exports = theme
`

	const themeDir = path.resolve(themeOutputPath, 'theme')
	mkdirp.sync(themeDir)
	fs.writeFileSync(path.join(themeDir, filename), fileContents)

	step.end()
}

const injectNamedColors = (themeJS) => {
	map(global.ljnTheme.colors.colors, (value, key) => {
		// eslint-disable-next-line no-param-reassign
		themeJS.colors[key] = resolveColor(value)
	})
}

const injectBackgroundColors = (themeJS) => {
	map(global.ljnTheme.colors.backgrounds, (value, key) => {
		// eslint-disable-next-line no-param-reassign
		themeJS.colors[`bg-${key}`] = resolveColor(value)
	})
}

// FIXME: not currently supporting deep hierarchies of foregrounds...
const injectForegroundColorsInBackgroundTheme = (themeJS, background) => {
	map(global.ljnTheme.colors.foregrounds, (value, key) => {
		// eslint-disable-next-line no-param-reassign
		themeJS.colors[key] = resolveColor(typeof value === 'object' ? value[background] || value.default : value)
	})
}

const injectAllForegroundColors = (themeJS) => {
	Object.keys(global.ljnTheme.colors.backgrounds).forEach((background) =>
		map(global.ljnTheme.colors.foregrounds, (value, key) => {
			// eslint-disable-next-line no-param-reassign
			themeJS.colors[`fg-${key}-on-${background}`] = resolveColor(
				typeof value === 'object' ? value[`on-${background}`] || value.default : value
			)
		})
	)
}

const injectColorMeta = (themeJS, background) => {
	/* Useful if you need a mapping from a theme color name to a unique identifier
	 * based on the actual color, eg. to generate icon sprites for each color in
	 * the theme. */
	// eslint-disable-next-line no-param-reassign
	themeJS.colorMeta = {
		static: Object.keys(global.ljnTheme.colors.colors),
		variable: {},
		defaultBackground: global.ljnTheme.colors.defaultBackground,
		defaultColor: global.ljnTheme.colors.defaultColor,
	}

	Object.keys(global.ljnTheme.colors.foregrounds).forEach((foreground) => {
		// eslint-disable-next-line no-param-reassign
		themeJS.colorMeta.variable[foreground] = resolveColor(foreground, background || 'default', 'origin')
	})
}

const makeThemeObject = (background = null) => {
	const themeJS = { ...global.ljnTheme, colors: {} }

	injectNamedColors(themeJS)
	injectBackgroundColors(themeJS)
	injectAllForegroundColors(themeJS)

	if (background) {
		injectForegroundColorsInBackgroundTheme(themeJS, `on-${background}`)
		themeJS.colors.background = resolveColor(global.ljnTheme.colors.backgrounds[background])
	} else {
		injectForegroundColorsInBackgroundTheme(themeJS, `default`)
		themeJS.colors.background = global.ljnTheme.colors.defaultBackground

		// We only need the colorMeta in the index theme. Keep it light.
		injectColorMeta(themeJS, background)
	}

	return themeJS
}

/**
 * Creates the theme.js file to be used by xstyled.
 * @param {object} dirs The directories for this run of the CLI.
 */
const createThemeJS = async (dirs) => {
	step.start('Preparing to generate theme files')
	const themeJS = makeThemeObject()
	step.end()

	makeThemeFile(dirs, 'index.js', themeJS)

	map(global.ljnTheme.colors.backgrounds, (bgValue, bgKey) => {
		const bgThemeJS = makeThemeObject(bgKey)
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
