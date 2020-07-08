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
const injectForegroundColors = (themeJS, background) => {
	map(global.ljnTheme.colors.foregrounds, (value, key) => {
		themeJS.colors[`fg-${key}`] = resolveColor(typeof value === 'object' ? value[background] || value.default : value)
	})
}

/**
 * Creates the theme.js file to be used by xstyled.
 * @param dirs
 * @returns {Promise} Nothing.
 */
const createThemeJS = async (dirs) => {
	step.start('Preparing to generate theme files')
	const themeJS = { ...global.ljnTheme, colors: {} }
	injectNamedColors(themeJS)
	injectBackgroundColors(themeJS)
	injectForegroundColors(themeJS, 'default')
	step.end()

	makeThemeFile(dirs, 'index.js', themeJS)

	Object.keys(global.ljnTheme.colors.backgrounds).forEach((background) => {
		const bgThemeJS = { colors: {} }
		injectForegroundColors(bgThemeJS, `on-${background}`)
		makeThemeFile(dirs, `on${startCase(camelCase(background))}.js`, bgThemeJS)
	})
}

/**
 * Creates the OnBackground component with props allowing developers to use a
 * customised theme with typechecking and a clean API.
 * @param root0
 * @param root0.themeOutputPath
 * @returns {Promise} Nothing.
 */
const createOnBackground = async ({ themeOutputPath }) => {
	step.start('Generating the OnBackground component')

	const fileContents = `import React, { FunctionComponent, ReactNode } from 'react'
import { ThemeProvider } from '@xstyled/styled-components'

import BackgroundColors from 'interfaces/theme/backgroundColors'
import defaultTheme from 'theme/theme'
${Object.keys(global.ljnTheme.colors.backgrounds)
	.map((theme) => `import ${theme}Theme from 'theme/on${startCase(camelCase(theme))}.js'`)
	.join('\n')}

const backgroundThemes = {
${Object.keys(global.ljnTheme.colors.backgrounds)
	.map((theme) => `	${theme}: ${theme}Theme,`)
	.join('\n')}
}

interface IOnBackgroundProps {
	background: BackgroundColors
	children?: ReactNode
}

const OnBackground: FunctionComponent<IOnBackgroundProps> = ({ background = 'default', children = null }) => {
	let theme = null

	if (background !== 'default') {
		theme = Object.assign(theme || {}, backgroundThemes[background])
	}

	return <ThemeProvider theme={theme || defaultTheme}>{children}</ThemeProvider>
}

export default OnBackground
`

	const themeDir = path.resolve(themeOutputPath, 'theme')
	mkdirp.sync(themeDir)
	fs.writeFileSync(path.join(themeDir, 'OnBackground.tsx'), fileContents)

	step.end()
}

module.exports = {
	createThemeJS,
	createOnBackground,
}
