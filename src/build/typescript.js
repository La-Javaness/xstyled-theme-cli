const fs = require('fs')
const { snakeCase } = require('lodash')
const mkdirp = require('mkdirp')
const path = require('path')
const ts = require('typescript')

const { error, step } = require('../logger')
const readDir = require('../utils/readDir')

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

const transpileTS = async (dirs) => {
	const { themeOutputPath } = dirs

	step.start('Transpiling TypeScript enums')
	const enumsPath = path.join(themeOutputPath, 'enums')
	const inputFiles = (await readDir(enumsPath))
		.filter((file) => !file.endsWith('.d.ts') && file.endsWith('.ts'))
		.map((tsFilename) => path.join(enumsPath, tsFilename))

	const options = {
		/* Here the compiler options */
		allowSyntheticDefaultImports: true,
		declaration: true,
		declarationDir: path.join(themeOutputPath, 'declarations'),
		outDir: path.join(themeOutputPath, 'enums'),
		esModuleInterop: true,
		// moduleResolution: 'node',
		sourceMap: false,
		jsx: 'react',
		target: 'ES5',
	}

	const program = ts.createProgram(inputFiles, options)
	const emitResult = program.emit()
	const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

	allDiagnostics.forEach((diagnostic) => {
		if (diagnostic.file) {
			const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
			const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
			error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`, false)
		} else {
			error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'), false)
		}
	})

	const exitCode = emitResult.emitSkipped ? 1 : 0
	if (exitCode) {
		error('Some TypeScript errors were found, please file a bug against xstyled-theme.')
	}

	step.end()
}

module.exports = {
	generateEnumFromArray,
	generateEnumFromObject,
	transpileTS,
}
