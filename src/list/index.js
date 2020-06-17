const chalk = require('chalk')
const readPackageTree = require('read-package-tree')

const { log, error } = require('../logger')
const getCurrentTheme = require('../utils/getCurrentTheme')

module.exports = async (dirs, args) => {
	const { rootPath } = dirs
	const opts = {
		machine: args.machine || args.m || false,
	}

	if (!opts.machine) {
		log('header', 'Looking up installed themes')
	}

	let pkgData
	try {
		pkgData = await readPackageTree(rootPath)
	} catch (e) {
		error(e)
	}

	const themes = pkgData.children.map((child) => child.package).filter((child) => !!child.xstyledTheme)

	if (!opts.machine) {
		const currentSuffix = ' [*]'
		const currentTheme = getCurrentTheme(dirs)

		const longestNameLength = Math.max(
			currentTheme.length + currentSuffix.length,
			...themes.map((theme) => theme.name.length)
		)

		themes.forEach((theme) => {
			const isCurrent = currentTheme === theme.name
			const headerText = isCurrent ? `${theme.name}${currentSuffix}` : theme.name
			const padding = ' '.repeat(longestNameLength - headerText.length)
			const header = isCurrent
				? chalk.bgBlueBright.whiteBright.bold(headerText)
				: chalk.bgBlue.whiteBright(headerText)

			process.stdout.write(`${header}:${padding} ${theme.description || chalk.dim.italic('no description')}\n`)
		})

		log('success', '\nDone!\n')
	} else {
		themes.forEach((theme) => process.stdout.write(`${theme.name}\n`))
	}
}
