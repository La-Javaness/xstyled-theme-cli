# [2.0.0](https://github.com/La-Javaness/xstyled-theme-cli/compare/v1.2.0...v2.0.0) (2020-09-15)


### Bug Fixes

* Disable node resolution mode as it caused crashes ([9676c62](https://github.com/La-Javaness/xstyled-theme-cli/commit/9676c625d8154ea5305e46cf3d508ef6c72223e9))
* Repair issues caused by semantic-release crashes ([745d3ab](https://github.com/La-Javaness/xstyled-theme-cli/commit/745d3aba745aa28e7066f06e7fc67911d382990e))


### Features

* Add code to purge old JS files in a build dir ([8e3d039](https://github.com/La-Javaness/xstyled-theme-cli/commit/8e3d0395d595c9a29a9bc248a0f4f475dcc25b0f))
* Add code to transpile JS (but don't use it!) ([0a29be9](https://github.com/La-Javaness/xstyled-theme-cli/commit/0a29be90d6a27afaa6f7ad159b10f0a05c34f7bb))
* Add color support to the textStyles schema ([d01c68d](https://github.com/La-Javaness/xstyled-theme-cli/commit/d01c68d34ecd6eca177e4d7bb66dd0e4b965824b))
* Add defaultBackground and defaultColor to spec ([989a921](https://github.com/La-Javaness/xstyled-theme-cli/commit/989a921df58a9652c78b84adc0bd0a40c3946722))
* Add meta section with text style names to themes ([b272961](https://github.com/La-Javaness/xstyled-theme-cli/commit/b272961b43aebecdeb839e4bf69fd61aacfedc6e))
* Disable debug info by default ([183b595](https://github.com/La-Javaness/xstyled-theme-cli/commit/183b5952e3780500ea3f5f76052bb4b09ef31088))
* Generate more icon sprites to match foreground colors too ([4a70ddd](https://github.com/La-Javaness/xstyled-theme-cli/commit/4a70dddc3802037ad5fa8c4829ff840496838d75))
* Generate smarter color mappings ([4f74c7e](https://github.com/La-Javaness/xstyled-theme-cli/commit/4f74c7ed08a1b9ab6702f23473d66663e8393c38))
* Implement CSS-in-JS syntax for component specifications ([41a9dcc](https://github.com/La-Javaness/xstyled-theme-cli/commit/41a9dcc2626aac4e050f10d173da812bb0054c91))
* Improve color handling in icon generation and ensure clean SVGO ([67616dc](https://github.com/La-Javaness/xstyled-theme-cli/commit/67616dccf25002eeff153c99bbf69bdd9eba78e7))
* Inject a lot more colours in themes ([b2f4cd6](https://github.com/La-Javaness/xstyled-theme-cli/commit/b2f4cd6797c44cd0291e0f9f548c89e92c0a1171))
* Properly fill circles in Icons ([0cbb6ae](https://github.com/La-Javaness/xstyled-theme-cli/commit/0cbb6ae13fff81cd85312dcd6d28330cd522f876))
* Support string syntaxes for spaces in @xstyled/system ([54e60f4](https://github.com/La-Javaness/xstyled-theme-cli/commit/54e60f43b868aaae256ceb4bcbb32236f2a89a95))
* Support text decoration and transform in text styles ([1bb7f7d](https://github.com/La-Javaness/xstyled-theme-cli/commit/1bb7f7d15d0b5d8923b22e30f696b0a5339b0289))


### BREAKING CHANGES

* Yaml component files are temporarily no longer supported.

You will need relevant @xstyled-theme/system helpers in your JS codebase
to connect to this new component format. The documentation is temporarily
outdated.
* fg-foo colors are now named foo directly, and the 
background color is automatically added to all theme files.

# [1.2.0](https://github.com/La-Javaness/xstyled-theme-cli/compare/v1.1.1...v1.2.0) (2020-07-07)


### Features

* Re-enable Typecript compilation to support JS codebases ([a5cbaca](https://github.com/La-Javaness/xstyled-theme-cli/commit/a5cbaca8344cb0da9c8007e53dca5cbf8f13c666))

## [1.1.1](https://github.com/La-Javaness/xstyled-theme-cli/compare/v1.1.0...v1.1.1) (2020-07-06)


### Bug Fixes

* Rename utils to internals also in generated theme code ([a5ec5fb](https://github.com/La-Javaness/xstyled-theme-cli/commit/a5ec5fb1c49d957249417b2319bb6172b7e9eae1))

# [1.1.0](https://github.com/La-Javaness/xstyled-theme-cli/compare/v1.0.0...v1.1.0) (2020-07-03)


### Features

* Rename @xstyled-theme/utils to @xstyled-theme/internals ([549009c](https://github.com/La-Javaness/xstyled-theme-cli/commit/549009c2468734cdbf8508d67fad9907e64064c9))

# 1.0.0 (2020-07-03)


### Bug Fixes

* Disable TS compilation due to module resolution issues in callees ([a3927ad](https://github.com/La-Javaness/xstyled-theme-cli/commit/a3927add0cd69160a4646c546185f28ca59b46e1))
* Fix incorrect data type in typography template ([8f9b462](https://github.com/La-Javaness/xstyled-theme-cli/commit/8f9b462e52e36b077da57ce646fe7129b924a586))
* Use safer method to generate theme files ([0d275cc](https://github.com/La-Javaness/xstyled-theme-cli/commit/0d275ccba63de94fdd4efc781e8dd3097cd58769))


### Features

* Add color template that matches the rest of the templates ([e6922f4](https://github.com/La-Javaness/xstyled-theme-cli/commit/e6922f4165899320acfa0b1e34ed64047ddd500e))
* Add command to list installed themes in a project ([514f704](https://github.com/La-Javaness/xstyled-theme-cli/commit/514f70446f4ef415acc5d96831f89e21a3f3374f))
* Add component folder init to the init command ([424e7d7](https://github.com/La-Javaness/xstyled-theme-cli/commit/424e7d7eef549b632c1df8f773bc8609b90e846c))
* Add optional default value export to TS enums ([9deb250](https://github.com/La-Javaness/xstyled-theme-cli/commit/9deb250d7b08b779f76b2069e3c5cb91336f7a0f))
* Add partial implementation of init command ([2c253ee](https://github.com/La-Javaness/xstyled-theme-cli/commit/2c253ee308ece652a82f3ed642eb70a3da3ffa48))
* Add source templates and asset READMEs ([b96acd7](https://github.com/La-Javaness/xstyled-theme-cli/commit/b96acd778864415f76b9b828b3c5582fdb7723af))
* Add support for static images in themes ([4a5226e](https://github.com/La-Javaness/xstyled-theme-cli/commit/4a5226eccc59f65a6512471d2654cd9e3298ff3d))
* Add util to retrieve current theme ([dbe8739](https://github.com/La-Javaness/xstyled-theme-cli/commit/dbe873980480104085f0795986b5c3c038973976))
* Compile declarations for TS enums ([5dad442](https://github.com/La-Javaness/xstyled-theme-cli/commit/5dad442df6d25f248880366b9b959acea9b0d57b))
* Finalise manifest writing for theme generation ([895fd8b](https://github.com/La-Javaness/xstyled-theme-cli/commit/895fd8bf4dad2509e3a67fab97e3ce1161b5f461))
* Generate any abstract structure as-is, instead of only borders ([dcc80ca](https://github.com/La-Javaness/xstyled-theme-cli/commit/dcc80ca5688c7315b60e917a0cad4b7b26bb1256))
* Help users avoid common typos in the typography file ([f32d75a](https://github.com/La-Javaness/xstyled-theme-cli/commit/f32d75a7db1a64c134136090b38108c4a1b1893d))
* Initial commit of xstyled-theme as a CLI ([c00b208](https://github.com/La-Javaness/xstyled-theme-cli/commit/c00b208708eeacbd7ff0289b3378953f4f11be18))
* Parse component APIs and variant declarations ([5a2fc48](https://github.com/La-Javaness/xstyled-theme-cli/commit/5a2fc48d8dfe0b44d88764fceb24f5f2d44b0a1c))
* Reorganise file structure of theme builds ([dca8366](https://github.com/La-Javaness/xstyled-theme-cli/commit/dca836696a569a41d08da9c3f808373d24f4db50))
* Tolerate empty asset folders in themes ([29c5b89](https://github.com/La-Javaness/xstyled-theme-cli/commit/29c5b89d077da6cb73ec5870f4ecfab477bd035a))
* Write help and improve error messages ([00b184b](https://github.com/La-Javaness/xstyled-theme-cli/commit/00b184b303184cf12fa939a03a941401aed22e51))


### BREAKING CHANGES

* No more compiled files for TypeScript sources! Use 
@xstyled-theme/config to be able to load the TS enums for now.
