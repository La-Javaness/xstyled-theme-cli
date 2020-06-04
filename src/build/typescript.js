const fs = require('fs')
const { snakeCase } = require('lodash')
const mkdirp = require('mkdirp')
const path = require('path')

const { step } = require('../logger')

const generateEnumPrivate = ({ themeOutputPath }, filename, enumName, filler, enumDefault = null) => {
	step.start(`Generating TypeScript enum '${enumName}'`)
	const contents = `
enum ${enumName} {
${filler.join(',\n')}
}

export default ${enumName}${
		enumDefault
			? `

export const Default${
					enumName.endsWith('s') ? enumName.substring(0, enumName.length - 1) : enumName
			  } = ${enumName}.${enumDefault}
	`
			: ''
	}
`

	const destDir = path.join(themeOutputPath, 'enums')
	mkdirp.sync(destDir)
	fs.writeFileSync(path.join(destDir, filename), contents)
	step.end()
}

const generateEnumFromArray = (dirs, filename, enumName, array, enumDefault = null) => {
	generateEnumPrivate(
		dirs,
		filename,
		enumName,
		array.map((name) => `\t${snakeCase(name).toUpperCase()} = '${name}'`),
		snakeCase(enumDefault).toUpperCase()
	)
}

const generateEnumFromObject = (dirs, filename, enumName, object, enumDefault = null) => {
	generateEnumPrivate(
		dirs,
		filename,
		enumName,
		Object.entries(object).map(([key]) => `\t${snakeCase(key).toUpperCase()} = '${key}'`),
		snakeCase(enumDefault).toUpperCase()
	)
}

module.exports = {
	generateEnumFromArray,
	generateEnumFromObject,
}
