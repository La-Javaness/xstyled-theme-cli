const { resolveColor } = require('../color')

describe('resolveColor', () => {
	beforeAll(() => {
		global.ljnTheme = {
			colors: {
				colors: {
					someBlue: '#0046ed',
					transitiveBlue: 'someBlue',
					veryTransitiveBlue: 'transitiveBlue',
				},
				backgrounds: {
					lightBackground: 'someBlue',
					darkBackground: '#010',
				},
				foregrounds: {
					foo: {
						bar: {
							default: '#5500cf',
							'on-darkBackground': '#ccff3b',
						},
						ter: '#6622cf',
					},
					xyz: 'transitiveBlue',
				},
			},
		}
	})
	afterAll(() => {
		delete global.ljnTheme
	})

	it('parses hex codes', () => {
		;['#000', '#fff', '#cc3399'].forEach((hexCode) => {
			expect(resolveColor(hexCode)).toBe(hexCode)
		})
	})

	it('parses rgb codes', () => {
		;['rgb(255, 44, 1)', 'rgb(54, 255, 0)', 'rgb(94,192,4)'].forEach((rgbCode) => {
			expect(resolveColor(rgbCode)).toBe(rgbCode)
		})
	})

	it('parses rgba codes', () => {
		;['rgba(255, 44, 1, 1)', 'rgba(54, 255, 0, 0)', 'rgba(94,192,4,0.32)'].forEach((rgbCode) => {
			expect(resolveColor(rgbCode)).toBe(rgbCode)
		})
	})

	it('parses named colors', () => {
		expect(resolveColor('someBlue')).toBe('#0046ed')
	})

	it("parses the theme's color hierarchy", () => {
		expect(resolveColor('foo.bar', 'default')).toBe('#5500cf')
		expect(resolveColor('foo.bar', 'darkBackground')).toBe('#ccff3b')
		expect(resolveColor('foo.bar', 'nonExistent')).toBe('#5500cf') // same as default
		expect(resolveColor('foo.bar.on-darkBackground', 'default')).toBe('#ccff3b')
		expect(resolveColor('foo.ter', 'default')).toBe('#6622cf')
		expect(resolveColor('foo.ter', 'darkBackground')).toBe('#6622cf') // same as default
	})

	it('parses transitive named colors', () => {
		expect(resolveColor('transitiveBlue')).toBe('#0046ed')
		expect(resolveColor('veryTransitiveBlue')).toBe('#0046ed')
		expect(resolveColor('xyz')).toBe('#0046ed')
	})
})
