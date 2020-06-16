const inquirer = require('inquirer')
const parseGitConfig = require('parse-git-config')
const path = require('path')
const sortPackageJson = require('sort-package-json')

const { LICENSES } = require('../constants')
const { log, error, step } = require('../logger')
const checkForPackage = require('../utils/checkForPackage')
const cliName = require('../utils/cliName')
const parseGitUser = require('../utils/parseGitUser')
const writeFile = require('../utils/writeFile')

const cliManifest = require('../../package.json')

const buildAssets = require('./assets')
const buildComponentDir = require('./components')
const buildYmlSources = require('./ymlSources')

const askPackageInfo = async (dirs, args) => {
	const { rootPath } = dirs
	const info = {
		name: args.name || args.n || null,
		description: args.description || args.d || null,
		author: args.author || args.a || null,
		license: args.license || args.l || null,
		repositoryUrl: args.repository || args.u || null,
		registry: args.registry || args.r || null,
	}

	const promptOptions = []
	if (!info.name) {
		promptOptions.push({
			name: 'name',
			type: 'string',
			default: path.basename(rootPath),
			message: 'Theme name:',
		})
	}
	if (!info.description) {
		promptOptions.push({
			name: 'description',
			type: 'string',
			message: 'Theme description:',
		})
	}
	if (!info.author) {
		promptOptions.push({
			name: 'author',
			type: 'string',
			default: parseGitUser(dirs),
			message: 'Theme author:',
		})
	}
	if (!info.license) {
		promptOptions.push({
			name: 'license',
			type: 'list',
			choices: LICENSES,
			default: 'MIT',
			message: 'License:',
		})
	}
	if (!info.repository) {
		promptOptions.push({
			name: 'repositoryUrl',
			type: 'string',
			default: (() => {
				const config = parseGitConfig.sync({ cwd: rootPath })
				return (((config || {}).remote || {}).origin || {}).url || null
			})(), // FIXME TODO debug
			message: 'Repository URL:',
		})
	}
	if (!info.registry) {
		promptOptions.push({
			name: 'publishConfig.registry',
			type: 'string',
			default: 'https://registry.npmjs.org/', // TODO try to read npm config instead
			message: 'Registry URL:',
		})
	}

	return inquirer.prompt(promptOptions)
}

module.exports = async (dirs, args) => {
	const { rootPath } = dirs
	const opts = {
		private: args.private || args.p || false,
		version: args.version || args.v || '1.0.0',
	}

	log('header', 'Initialising a new xstyled-theme project')

	step.start("Checking that we're not inside an existing NPM repository")
	const hasPackage = await checkForPackage(dirs)
	if (hasPackage) {
		error(`Found an existing package.json, cannot proceed. Themes may only be created from empty directories.\n`)
	}
	step.end()

	const manifest = Object.assign(
		{
			version: opts.version,
			private: opts.private,
			files: ['dist'],
			scripts: {
				build: `${cliName} build`,
			},
			devDependencies: {
				[cliManifest.name]: `^${cliManifest.version}`,
			},
			// TODO add @xstyled-theme/utils as a peer dependency, same version
		},
		await askPackageInfo(dirs, args)
	)
	await writeFile(`${JSON.stringify(sortPackageJson(manifest), null, '\t')}\n`, path.join(rootPath, 'package.json'))

	log('header', 'Creating theme source files')
	await buildAssets(dirs, opts)
	await buildYmlSources(dirs, opts)
	await buildComponentDir(dirs, opts)

	// TODO add scripts to package.json
	// TODO add NPM registry and check package name

	log('success', '\nDone!\n')
}
