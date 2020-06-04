const chalk = require('chalk')
const { chalkFormat, log } = require('../logger')
const cliName = require('../utils/cliName')

const menu = {
	main: `
${chalkFormat('section', 'Usage:')}

	${chalk`{bold {cyanBright ${cliName}} {magentaBright command} [options]}`}

	To get help on a specific command, run ${chalk`{cyanBright ${cliName}} {magentaBright help} {italic <command>}`}


${chalkFormat('section', 'Project Commands:')}

	${chalk`{magentaBright search} {dim ...} Search through the list of available themes.`}

	${chalk`{magentaBright add} {dim ......} Install a theme in your project. If it is the first theme
	           you add, it will also become the project's current theme.`}

	${chalk`{magentaBright remove} {dim ...} Remove an installed theme from your project. Sets a new
	           current project if needed.`}

	${chalk`{magentaBright list} {dim .....} Show the list of themes installed in the project.`}

	${chalk`{magentaBright current} {dim ..} Set the theme to be used by the project on the next build,
	           or if no parameter is passed, show the current theme.`}


${chalkFormat('section', 'Theme Development Commands:')}

 	${chalk`{magentaBright init} {dim ....} Create a new theme in an empty folder. You must first run
	          {underline yarn init}.`}

	${chalk`{magentaBright build} {dim ...} Build a theme and associated asssets so it may be published.`}


${chalkFormat('section', 'Other Commands:')}

	${chalk`{magentaBright help} {dim .....} Show this help message, or the help for a specific command.`}

	${chalk`{magentaBright version} {dim ...} Show this CLI's version number.`}

`,
	add: `TODO add --registry flag\n`,
	build: `TODO\n`,
	current: `TODO explain\n`,
	list: `TODO\n`,
	init: `TODO. Args: Name, Author, License, Repository, Description, Version, Preset\n`,
	remove: `TODO\n`,
	search: `TODO add --registry flag\n`,
	version: `TODO add --json format\n`,
}

module.exports = (args) => {
	const subCmd = args._[0] === 'help' ? args._[1] : args._[0]
	log('', menu[subCmd] || menu.main)
}
