const fs = require('fs')
const { snakeCase } = require('lodash')
const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')

const generateEnumPrivate = ({ themeOutputPath }, filename, enumName, filler) => {
	step.start(`Generating TypeScript enum '${enumName}'`)
	const contents = `
enum ${enumName} {
${filler.join(',\n')}
}

export default ${enumName}
`

	const destDir = path.join(themeOutputPath, 'enums')
	mkdirp.sync(destDir)
	fs.writeFileSync(path.join(destDir, filename), contents)
	step.end()
}

const generateEnumFromArray = (dirs, filename, enumName, array) => {
	generateEnumPrivate(
		dirs,
		filename,
		enumName,
		array.map((name) => `\t${snakeCase(name).toUpperCase()} = '${name}'`)
	)
}

const generateEnumFromObject = (dirs, filename, enumName, object) => {
	generateEnumPrivate(
		dirs,
		filename,
		enumName,
		Object.entries(object).map(([key]) => `\t${snakeCase(key).toUpperCase()} = '${key}'`)
	)
}

module.exports = {
	generateEnumFromArray,
	generateEnumFromObject,
}
