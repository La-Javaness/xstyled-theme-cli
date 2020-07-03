# @xstyled-theme/cli
[![](https://img.shields.io/github/workflow/status/La-Javaness/xstyled-theme-cli/Release)](https://github.com/La-Javaness/xstyled-theme-cli/actions?query=workflow%3ARelease)
[![](https://img.shields.io/npm/v/@xstyled-theme/cli.svg)](https://www.npmjs.com/package/@xstyled-theme/cli)


This package is a command-line utility that helps you develop, build, deploy and use themes for the `@xstyled-theme` infrastructure.

A theme is a collection of design assets (fonts, images and icons), optimised for display on the Web, and theme declarations that are used to style compatible component toolkits and to build an [`@xstyled` theme](https://xstyled.dev/).

`@xstyled-theme` has been conceived as the infrastructure that allows arbitrary UI toolkits and arbitrary apps to expose an arbitrary theming API, which can then be used by arbitrary theme developers to theme said toolkits and applications. In this project, we always privilege flexibility. `@xstyled-theme` allows you to build arbitrarily complex color schemes and theme structures, and to theme any component you like with any API you can come up with.

The primary quality of `@xstyled-theme` is that it allows harnessing all the power and flexiblity of CSS-in-JS theming stacks without forcing designers to learn code. In `@xstyled-theme`, designers and developers agree on an API that is as simple as declaring a few variables, and designers can then develop and maintain themes in full autonomy.

**`@xstyled-theme` is an ongoing, actively developed project used in production on projects developed by [La Javaness](lajavaness.com). We welcome all inputs and contributions, but at this stage, please consider our API to be subject to drastic changes.**


## Install

```sh
yarn global add @xstyled-theme/cli
```


## Usage

```sh
xstyled-theme command [options]
```

This section is also available in the command-line with `xstyled-theme help`. To get help on a specific command, run `xstyled-theme help <command>`. Below is an explanation of the available commands.

### Project Commands

#### Search
Search through the list of available themes.

```sh
xstyled-theme search squirrel
```

#### Add
Install a theme in your project. If it is the first theme you add, it will also become the project's current theme.

```sh
xstyled-theme search add ljn-theme-squirrels
```

#### Remove
Remove an installed theme from your project. Sets a new current project if needed.

```sh
xstyled-theme search remove ljn-theme-squirrels
```

#### List
Show the list of themes installed in the project.

```sh
xstyled-theme list
```

#### Current
Show the list of themes installed in the project.

```sh
xstyled-theme current ljn-theme-chipmunk
```

Or if no parameter is passed, show the current theme.

```sh
xstyled-theme current
```


### Theme Development Commands
#### Init
Create a new theme in an empty folder.

```sh
mkdir my-new-theme
cd my-new-theme
xstyled-theme init
```

#### Build
Build a theme and associated asssets so it may be published.

```sh
xstyled-theme build
```





## Overall Architecture

TODO

## Theme Development

### Setup and Workflow
TODO

### Design Assets
TODO

### CSS-in-JS Exports
TODO

## Theme Usage

### In UI Toolkits
TODO

### In Apps
TODO
