const levenshtein = require('js-levenshtein')

const { COMMANDS } = require('../constants')

module.exports = (word) =>
	COMMANDS.map((command) => ({
		command,
		distance: levenshtein(word, command),
	})).reduce((accumulator, item) => (accumulator.distance < item.distance ? accumulator : item)).command
