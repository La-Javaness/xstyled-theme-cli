const SVGSpriter = require('svg-sprite')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const { map } = require('lodash')
const { rgbaToHex } = require('@xstyled-theme/system')

const { log, step } = require('../logger')
const readDir = require('../utils/readDir')

const { resolveColor } = require('./color')
const { generateEnumFromArray } = require('./typescript')

const _replaceFills = (content, color) => {
	if (color) {
		const resolvedFill = `fill="${resolveColor(color)}"`

		return content
			.replace(new RegExp('fill="[^"]+"', 'g'), '')
			.replace(new RegExp('<path', 'g'), `<path ${resolvedFill}`)
			.replace(new RegExp('<circle', 'g'), `<circle ${resolvedFill}`)
	}
	return content.replace(new RegExp('fill="[^"]+"', 'g'), '')
}

const _genOneSprite = (color, iconsContent, destDir) =>
	new Promise((resolve, reject) => {
		/* Skip sprite regeneration if in development/debug mode. Still generate the
		 * no-fill SVGO sprite for the sake of running the code and having the icons
		 * available and up-to-date for React component generation. */
		if (
			process.env.XSTYLED_THEME_DEBUG &&
			color &&
			fs.existsSync(path.join(destDir, 'view', `sprite-${color.substr(1)}.svg`))
		) {
			log('dim', `\nSkipping SVG sprite for '${color}' as a file already exists`)
			resolve()
			return
		}

		const spriterConfig = {
			dest: destDir,
			mode: {
				css: false,
				symbol: false,
				view: !!color && {
					dest: 'view',
					sprite: `sprite-${color ? color.substr(1) : 'nofill'}.svg`,
					bust: false,
					render: {
						css: true,
					},
					example: true,
				},
			},
			shape: {
				transform: ['svgo'],
				dest: 'svgo',
			},
		}
		const spriter = new SVGSpriter(spriterConfig)

		iconsContent.forEach((icon) => {
			spriter.add(icon.fullPath, path.basename(icon.fullPath), _replaceFills(icon.content, color))
		})

		spriter.compile((error, result) => {
			if (error) {
				reject(new Error(`Failed to compile: ${error}`))
				return
			}

			// eslint-disable-next-line guard-for-in
			for (const mode in result) {
				// eslint-disable-next-line guard-for-in
				for (const resource in result[mode]) {
					mkdirp.sync(path.dirname(result[mode][resource].path))
					fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents)
				}
			}

			resolve()
		})
	})

const genSprites = async (files, iconDir, destDir) => {
	const iconsContent = files
		.filter((file) => file.endsWith('.svg'))
		.map((file) => path.join(iconDir, file))
		.map((fullPath) => path.resolve(fullPath)) // TEMP https://github.com/jkphl/svg-sprite/issues/326
		.map((fullPath) => ({
			fullPath,
			content: fs.readFileSync(fullPath, { encoding: 'utf-8' }),
		}))

	/* Get all possible resolved colors for foregrounds, and then convert them to hex codes so we can
	 * always provide an icon sprite for a given theme color. */
	const spriteColors = new Set(Object.values(global.ljnTheme.colors.colors).map((colorName) => resolveColor(colorName)))
	Object.keys(global.ljnTheme.colors.backgrounds).forEach((background) =>
		map(global.ljnTheme.colors.foregrounds, (value) => {
			spriteColors.add(resolveColor(typeof value === 'object' ? value[`on-${background}`] || value.default : value))
		})
	)

	const spriteHexCodes = Array.from(spriteColors).map((code) => rgbaToHex(code))
	const spritePromises = spriteHexCodes.map((code) => _genOneSprite(code, iconsContent, destDir))

	/* NOTE: Gen a sprite which we'll toss away just to ensure we generate SVGOs
	 * without fill instructions. This will enable customisation of the inline
	 * SVG components with CSS `fill` instructions. */
	await Promise.all([...spritePromises, _genOneSprite(null, iconsContent, destDir)])
}

const genSvgComponents = (files, optimisedInputDir, componentDestDir) => {
	return new Promise((resolve) => {
		mkdirp.sync(componentDestDir)

		for (const file of files) {
			// Copied from https://www.npmjs.com/package/@nrk/svg-to-js
			const code = fs.readFileSync(path.join(optimisedInputDir, file), 'utf-8')
			const size = String(code.match(/viewBox="[^"]+/)).slice(9)
			const name = file.slice(0, -4)
			const body = code.replace(/^[^>]+>|<[^<]+$/g, '').replace(/\s*([<>])\s*/g, '$1') // Minified SVG body

			// eslint-disable-next-line no-template-curly-in-string
			const inlineSvg = body.replace(/fill="[^"]+"/, '${color ? `fill="${color}"` : \'\'}')

			const titleCase = name.replace(/-+./g, (m) => m.slice(-1).toUpperCase()).replace(/./, (m) => m.toUpperCase())
			const [w, h] = size
				.split(' ')
				.slice(2)
				.map((val) => `${Number(val).toFixed(3)}px`)
			const jsx = `return React.createElement('svg', {'aria-hidden': true, width: '${w}', height: '${h}', viewBox: '${size}', dangerouslySetInnerHTML: {__html: \`${inlineSvg}\`}})`

			fs.writeFileSync(
				path.join(componentDestDir, `${titleCase}.js`),
				`import React from 'react'\n\nconst ${titleCase} = ({color}) => {\n\t${jsx}\n}\n\nexport default ${titleCase}\n`
			)
		}

		resolve()
	})
}

/**
 * Loads icons from the assets directory, optimises them, builds SVG sprites and
 * React components out of the optimised icons, and generates a TS enum for icon names.
 * @param   {object}  dirs The input and output dirs for this instance of the CLI.
 * @returns {Promise} Nothing.
 */
const buildIcons = async (dirs) => {
	const { themeIconsPath, themeOutputPath } = dirs

	const destDir = path.join(themeOutputPath, 'icons')
	const componentDestDir = path.join(themeOutputPath, 'components', 'icons')

	step.start('Generating SVG Sprites')
	const inputFiles = await readDir(themeIconsPath)
	await genSprites(inputFiles, themeIconsPath, destDir)
	step.end()

	step.start('Generating React components out of the optimised SVG icons')
	const optimisedInputDir = path.join(destDir, 'svgo')
	// NOTE: Won't exist if there were no icons
	if (fs.existsSync(optimisedInputDir)) {
		const optimisedSvgs = await readDir(optimisedInputDir)
		await genSvgComponents(optimisedSvgs, optimisedInputDir, componentDestDir)
	}
	step.end()

	step.start('Adding icons to theme')
	global.ljnTheme.icons = inputFiles
		.filter((fullPath) => fullPath.endsWith('.svg'))
		.map((fullPath) => path.basename(fullPath))
		.map((filename) => filename.substring(0, filename.length - 4))
	step.end()

	generateEnumFromArray(dirs, 'iconNames.ts', 'IconNames', global.ljnTheme.icons)
}

module.exports = {
	buildIcons,
}
