const readDirs = require('./readDirs')

/**
 * Returns the list of JS files generated in a past run of the `build` command.
 * @param   {object}   dirs                 The resolved directories for this run of the CLI.
 * @param   {string}   dirs.themeOutputPath The path where the built theme files are written.
 * @param   {boolean}  withTypescript       Whether to include TS files.
 * @returns {string[]} The name of the current theme, or null if none is in use.
 */
module.exports = async ({ themeOutputPath }, withTypescript = false) => {
	const foldersWithJS = [
		`${themeOutputPath}/components`,
		`${themeOutputPath}/components/icons`,
		`${themeOutputPath}/icons`,
		`${themeOutputPath}/theme`,
	]
	const extensions = ['js', 'jsx']

	if (withTypescript) {
		foldersWithJS.push(`${themeOutputPath}/declarations`, `${themeOutputPath}/enums`)
		extensions.push('.ts', '.tsx', '.js.map')
	}
	const filesWithJS = (await readDirs(foldersWithJS)).filter((filepath) =>
		extensions.some((ext) => filepath.endsWith(ext))
	)

	return filesWithJS
}
