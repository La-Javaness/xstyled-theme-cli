const { log } = require('../logger')

const menu = {
	// TODO FIXME
	main: `
	FIXME THIS IS ALL WRONG
		ljn-theme build <options>

		-f --front \t\t Front-end project (browser)
		-b --back  \t\t Back-end project (NodeJS)

		ljn dotfiles [command] <options>

		install .......... initialise your project's configuration
		update ........... update existing dotfiles and dependencies
	`,
	help: `TODO`,
	version: `TODO`,
}

module.exports = (args) => {
	const subCmd = args._[0] === 'help' ? args._[1] : args._[0]
	log('', menu[subCmd] || menu.main)
}
