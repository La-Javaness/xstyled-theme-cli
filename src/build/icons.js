const SVGSpriter = require('svg-sprite')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const { map } = require('lodash')

const { step } = require('../logger')
const readDir = require('../utils/readDir')

const { resolveColor } = require('./color')
const { generateEnumFromArray } = require('./typescript')

const genSprites = async (files, iconDir, destDir) => {
	const iconsContent = files
		.filter((file) => file.endsWith('.svg'))
		.map((file) => path.join(iconDir, file))
		.map((fullPath) => path.resolve(fullPath)) // TEMP https://github.com/jkphl/svg-sprite/issues/326
		.map((fullPath) => ({
			fullPath,
			content: fs.readFileSync(fullPath, { encoding: 'utf-8' }),
		}))

	const spritePromises = map(
		global.ljnTheme.colors.colors,
		(value, key) =>
			new Promise(async (resolve, reject) => {
				const spriterConfig = {
					dest: destDir,
					mode: {
						css: false,
						symbol: false,
						view: {
							dest: 'view',
							sprite: `sprite-${key}.svg`,
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
					spriter.add(
						icon.fullPath,
						path.basename(icon.fullPath),
						icon.content.replace(/fill="[^"]+/, `fill="${resolveColor(value)}`)
					)
				})

				spriter.compile(function (error, result) {
					if (error) {
						reject(`Failed to compile: ${error}`)
					}

					for (const mode in result) {
						for (const resource in result[mode]) {
							mkdirp.sync(path.dirname(result[mode][resource].path))
							fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents)
						}
					}

					resolve()
				})
			})
	)

	return Promise.all(spritePromises)
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
 * @param dirs
 * @returns {Promise} Nothing.
 */
const buildIcons = async function (dirs) {
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
