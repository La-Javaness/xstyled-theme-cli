module.exports = {
	branches: ['master'],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		[
			'@semantic-release/changelog',
			{
				changelogFile: 'CHANGELOG.md',
			},
		],
		[
			'@semantic-release/git',
			{
				assets: ['build/*', 'CHANGELOG.md', 'package.json'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		[
			'@semantic-release/github',
			{
				assets: ['bin', 'src', 'templates', 'package.json'],
			},
		],
		'@semantic-release/npm',
	],
	repositoryUrl: 'git@github.com:La-Javaness/xstyled-theme-cli.git',
}
