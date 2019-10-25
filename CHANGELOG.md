## [3.1.4](https://github.com/kaisermann/svelte-preprocess/compare/v3.1.3...v3.1.4) (2019-10-23)


### Bug Fixes

* don't try to include local files that doesn't exist ([52594eb](https://github.com/kaisermann/svelte-preprocess/commit/52594eb79e7533a442fd7063ef1e2e269269dbc3))



## [3.1.3](https://github.com/kaisermann/svelte-preprocess/compare/v3.1.2...v3.1.3) (2019-10-23)

### Bug Fixes

- :bug: Try to only include files with local paths ([4c2c4e3](https://github.com/kaisermann/svelte-preprocess/commit/4c2c4e317e8de62bc161e7a1626892f08e98ce82))

## [3.1.2](https://github.com/kaisermann/svelte-preprocess/compare/v3.1.1...v3.1.2) (2019-09-25)

### Bug Fixes

- 🐛 import less cjs instead of es6 ([bf8627f](https://github.com/kaisermann/svelte-preprocess/commit/bf8627f3f4bde0d598769a67de10194bbcf04701))

## [3.1.1](https://github.com/kaisermann/svelte-preprocess/compare/v3.1.0...v3.1.1) (2019-09-10)

### Bug Fixes

- 🐛 make [@keyframe](https://github.com/keyframe) at-rules global. ([#65](https://github.com/kaisermann/svelte-preprocess/issues/65)) ([40fb9be](https://github.com/kaisermann/svelte-preprocess/commit/40fb9be28e5737259754e9b1168efcaf25eef171))

# [3.1.0](https://github.com/kaisermann/svelte-preprocess/compare/v3.0.2...v3.1.0) (2019-09-03)

### Features

- 🎸 add "markupTagName" option ([746d2ab](https://github.com/kaisermann/svelte-preprocess/commit/746d2abbaaf072d3fac29cc2d2c0f61fa28d58e8))

## [3.0.2](https://github.com/kaisermann/svelte-preprocess/compare/v3.0.1...v3.0.2) (2019-08-29)

### Bug Fixes

- 🐛 inverted conditionals on typescript transformer ([a6937f0](https://github.com/kaisermann/svelte-preprocess/commit/a6937f0d9895ceca69bbb335d918bbe69d16c2a4))

## [3.0.1](https://github.com/kaisermann/svelte-preprocess/compare/v3.0.0...v3.0.1) (2019-08-29)

### Bug Fixes

- 🐛 wrong typescript diagnostic filtering ([2630a44](https://github.com/kaisermann/svelte-preprocess/commit/2630a44f4d6036a87f7120b5482b2c236cccd9a0)), closes [#49](https://github.com/kaisermann/svelte-preprocess/issues/49)

# [3.0.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.16.0...v3.0.0) (2019-08-28)

### Performance Improvements

- ⚡️ make postcss-load-config optional for better pkg size ([7ab9c72](https://github.com/kaisermann/svelte-preprocess/commit/7ab9c72797a3b702f2f3dd9280402b84057398be))

### BREAKING CHANGES

- To load PostCSS config automatically from a file, now it's needed to
  manually install "postcss-load-config".

# [2.16.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.15.2...v2.16.0) (2019-08-28)

### Features

- 🎸 add "transpileOnly" option to skip type check ([3e46741](https://github.com/kaisermann/svelte-preprocess/commit/3e46741d917b8be5dcd331f5672bcd0c7ff75090)), closes [#54](https://github.com/kaisermann/svelte-preprocess/issues/54)

## [2.15.2](https://github.com/kaisermann/svelte-preprocess/compare/v2.15.0...v2.15.2) (2019-08-28)

### Bug Fixes

- 🐛 make pug mixins work with space AND tabs ([81b0154](https://github.com/kaisermann/svelte-preprocess/commit/81b0154a2e90375a9f5793c8d7fd32698ef9f432))
- rename typescript configuration option to honor the readme docs ([67f2137](https://github.com/kaisermann/svelte-preprocess/commit/67f2137f9b6c11f3d2f4508d6dab2699e0d0b823))

# [2.15.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.14.4...v2.15.0) (2019-07-20)

### Features

- 🎸 add external src support for stand-alone processors ([974ab5a](https://github.com/kaisermann/svelte-preprocess/commit/974ab5a05c37e32da1abe0e59fb777d07efb0b3c))

## [2.14.4](https://github.com/kaisermann/svelte-preprocess/compare/v2.14.3...v2.14.4) (2019-07-06)

### Features

- 🎸 allow to watch stylus dependencies ([8aa3dfc](https://github.com/kaisermann/svelte-preprocess/commit/8aa3dfcd73730688c3a4d555ebf5a56cf36c669f))

## [2.14.3](https://github.com/kaisermann/svelte-preprocess/compare/v2.14.1...v2.14.3) (2019-07-01)

### Bug Fixes

- 🐛 pass less [@imports](https://github.com/imports) as dependencies to svelte ([55e9d28](https://github.com/kaisermann/svelte-preprocess/commit/55e9d28fd03a2a1bf07c4d1b9ec3517fe2ce0cb3))
  <<<<<<< HEAD
  =======
- pug mixin elseif ([#45](https://github.com/kaisermann/svelte-preprocess/issues/45)) ([98ad9ca](https://github.com/kaisermann/svelte-preprocess/commit/98ad9ca996c70da25666e4f1e9286d4dfd15fb36))
  > > > > > > > chore: release v3.2.0-alpha.1

## [2.14.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.14.0...v2.14.1) (2019-06-28)

### Bug Fixes

<<<<<<< HEAD

- # pug mixin elseif ([#45](https://github.com/kaisermann/svelte-preprocess/issues/45)) ([98ad9ca](https://github.com/kaisermann/svelte-preprocess/commit/98ad9ca996c70da25666e4f1e9286d4dfd15fb36))
- 🐛 transformer imported dependencies being overwritten ([423c17a](https://github.com/kaisermann/svelte-preprocess/commit/423c17a23283bca40ac0d8adf192ec1037196a12))
  > > > > > > > chore: release v3.2.0-alpha.1

# [2.14.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.13.1...v2.14.0) (2019-06-22)

<<<<<<< HEAD

- # 🐛 transformer imported dependencies being overwritten ([423c17a](https://github.com/kaisermann/svelte-preprocess/commit/423c17a23283bca40ac0d8adf192ec1037196a12))

## [2.13.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.13.0...v2.13.1) (2019-06-21)

> > > > > > > chore: release v3.2.0-alpha.1

# [2.13.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.12.0...v2.13.0) (2019-06-21)

# [2.12.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.11.0...v2.12.0) (2019-06-03)

### Features

- prepend scss with data property ([#36](https://github.com/kaisermann/svelte-preprocess/issues/36)) ([dfa2b2a](https://github.com/kaisermann/svelte-preprocess/commit/dfa2b2a24124c94c3d3af6e63eff8963489f7caa))

# [2.11.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.10.0...v2.11.0) (2019-05-29)

### Features

- 🎸 add svelte pug mixins ([#38](https://github.com/kaisermann/svelte-preprocess/issues/38)) ([543ab75](https://github.com/kaisermann/svelte-preprocess/commit/543ab7557bd8e8172ea52e89355101d3c88a38ba))

# [2.10.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.9.1...v2.10.0) (2019-05-27)

### Features

- 🎸 add support for typescript type checking ([#37](https://github.com/kaisermann/svelte-preprocess/issues/37)) ([e6dd744](https://github.com/kaisermann/svelte-preprocess/commit/e6dd7441db64906f79d7105723e23a8ef949e2d5))

## [2.9.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.9.0...v2.9.1) (2019-05-27)

### Bug Fixes

- 🐛 template preprocessing running on the whole file ([e37da9d](https://github.com/kaisermann/svelte-preprocess/commit/e37da9d5f8f5fde5077e02add17be039db729e32))
  <<<<<<< HEAD
  =======

# [2.9.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.8.0...v2.9.0) (2019-05-15)

# [2.8.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.7.1...v2.8.0) (2019-05-15)

> > > > > > > chore: release v3.2.0-alpha.1

### Features

<<<<<<< HEAD

- 🎸 add support for typescript type checking ([#37](https://github.com/kaisermann/svelte-preprocess/issues/37)) ([e6dd744](https://github.com/kaisermann/svelte-preprocess/commit/e6dd7441db64906f79d7105723e23a8ef949e2d5))
- 🎸 add svelte pug mixins ([#38](https://github.com/kaisermann/svelte-preprocess/issues/38)) ([543ab75](https://github.com/kaisermann/svelte-preprocess/commit/543ab7557bd8e8172ea52e89355101d3c88a38ba))
- 🎸 add typescript preprocessor ([c195aa1](https://github.com/kaisermann/svelte-preprocess/commit/c195aa183b60899603d72743432de501b23f6087))
- # prepend scss with data property ([#36](https://github.com/kaisermann/svelte-preprocess/issues/36)) ([dfa2b2a](https://github.com/kaisermann/svelte-preprocess/commit/dfa2b2a24124c94c3d3af6e63eff8963489f7caa))
- 🎸 add typescript preprocessor ([c195aa1](https://github.com/kaisermann/svelte-preprocess/commit/c195aa183b60899603d72743432de501b23f6087))
  > > > > > > > chore: release v3.2.0-alpha.1

## [2.7.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.6.5...v2.7.1) (2019-05-08)

### Bug Fixes

- 🐛 cut 90% of downloaded package size ([882a4dd](https://github.com/kaisermann/svelte-preprocess/commit/882a4dd5c185c5063ceb27884877958d4178c0e8))

### Features

- 🎸 watch internal files imported with postcss-import ([5b14624](https://github.com/kaisermann/svelte-preprocess/commit/5b14624ac04a9812e680b252b8f6d69c97c30188))

## [2.6.5](https://github.com/kaisermann/svelte-preprocess/compare/v2.6.4...v2.6.5) (2019-05-05)

### Bug Fixes

- 🐛 stand-alone processors not exported ([ced0fd1](https://github.com/kaisermann/svelte-preprocess/commit/ced0fd1dfc34e13aefa13ba9d31efd81255e348d))

## [2.6.4](https://github.com/kaisermann/svelte-preprocess/compare/v2.6.3...v2.6.4) (2019-05-05)

### Bug Fixes

- 🐛 less and stylus stand-alone processor ([85827bb](https://github.com/kaisermann/svelte-preprocess/commit/85827bbd53340b39b99b706f03c926d3b01bbad6))

## [2.6.3](https://github.com/kaisermann/svelte-preprocess/compare/v2.6.2...v2.6.3) (2019-05-01)

### Features

- support dart-sass ([e56f8b2](https://github.com/kaisermann/svelte-preprocess/commit/e56f8b24c8f93db82ef9bb0f17dd658aaf000126))

## [2.6.2](https://github.com/kaisermann/svelte-preprocess/compare/v2.5.2...v2.6.2) (2019-04-11)

### Bug Fixes

- 🐛 standalone processors breaking everything :) ([ce11323](https://github.com/kaisermann/svelte-preprocess/commit/ce113236f0ca2fe5876b75d7c9935f664634cae0))

### Features

- 🎸 add stand-alone processors ([f19c90a](https://github.com/kaisermann/svelte-preprocess/commit/f19c90a1ed2838a8712b0c95dccbd8b005d8f9c0))

## [2.5.2](https://github.com/kaisermann/svelte-preprocess/compare/v2.5.1...v2.5.2) (2019-04-10)

### Features

- 🎸 support async onBefore() ([a6af2a2](https://github.com/kaisermann/svelte-preprocess/commit/a6af2a276cfc728ed60631eba5072b83cb035991))

## [2.5.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.4.2...v2.5.1) (2019-04-02)

### Bug Fixes

- 🐛 custom transformer not working with external src files ([cc037c3](https://github.com/kaisermann/svelte-preprocess/commit/cc037c3cdae72f16c1f977986a1434006dc3fe96))

## [2.4.2](https://github.com/kaisermann/svelte-preprocess/compare/v2.4.1...v2.4.2) (2018-11-03)

## [2.4.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.4.0...v2.4.1) (2018-11-02)

# [2.4.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.3.1...v2.4.0) (2018-11-01)

## [2.3.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.2.2...v2.3.1) (2018-09-01)

## [2.2.2](https://github.com/kaisermann/svelte-preprocess/compare/v2.2.1...v2.2.2) (2018-07-18)

## [2.2.1](https://github.com/kaisermann/svelte-preprocess/compare/v2.2.0...v2.2.1) (2018-07-18)

# [2.2.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.1.4...v2.2.0) (2018-07-18)

## [2.1.3](https://github.com/kaisermann/svelte-preprocess/compare/v2.1.0...v2.1.3) (2018-06-21)

# [2.1.0](https://github.com/kaisermann/svelte-preprocess/compare/v2.0.5...v2.1.0) (2018-06-20)

## [2.0.5](https://github.com/kaisermann/svelte-preprocess/compare/v2.0.4...v2.0.5) (2018-05-17)

## [2.0.4](https://github.com/kaisermann/svelte-preprocess/compare/v2.0.3...v2.0.4) (2018-05-17)

## [2.0.2](https://github.com/kaisermann/svelte-preprocess/compare/v2.0.1...v2.0.2) (2018-05-15)

## [2.0.1](https://github.com/kaisermann/svelte-preprocess/compare/1.1.2...v2.0.1) (2018-05-15)

## 1.1.2 (2018-05-14)
