<a name="5.0.3"></a>
## [5.0.3](https://github.com/kazupon/vue-i18n/compare/v5.0.2...v5.0.3) (2017-02-27)


### :zap: Improvements

* **vue:** support vue 2.2 ([de6429b](https://github.com/kazupon/vue-i18n/commit/de6429b))



<a name="5.0.2"></a>
## [5.0.2](https://github.com/kazupon/vue-i18n/compare/v5.0.1...v5.0.2) (2017-02-18)


### :zap: Improvements

* **npm:** revert node >= 6.0 engine restriction ([#110](https://github.com/kazupon/vue-i18n/issues/110)) by [@syxolk](https://github.com/syxolk) ([92b1bd1](https://github.com/kazupon/vue-i18n/commit/92b1bd1)), closes [#109](https://github.com/kazupon/vue-i18n/issues/109)



<a name="5.0.1"></a>
## [5.0.1](https://github.com/kazupon/vue-i18n/compare/v5.0.0...v5.0.1) (2017-02-16)


### :zap: Improvements

* **asset:** update locale reactivity setting ([b42fd9a](https://github.com/kazupon/vue-i18n/commit/b42fd9a))



<a name="5.0.0"></a>
# [5.0.0](https://github.com/kazupon/vue-i18n/compare/v4.10.0...v5.0.0) (2017-02-04)


### :boom: Breaking changes

* drop vue 1.0 supporting ([4da26cf](https://github.com/kazupon/vue-i18n/commit/4da26cf)), closes [#105](https://github.com/kazupon/vue-i18n/issues/105)



<a name="4.10.0"></a>
# [4.10.0](https://github.com/kazupon/vue-i18n/compare/v4.9.0...v4.10.0) (2017-01-01)


### :star: New Features

* `$lang` property for all component ([#99](https://github.com/kazupon/vue-i18n/issues/99)) by [@albert](https://github.com/albert)-zhang ([5ed69f8](https://github.com/kazupon/vue-i18n/commit/5ed69f8))


### :up: Updates

* **override:** change langVM keeping variable name ([3ec1bb2](https://github.com/kazupon/vue-i18n/commit/3ec1bb2))



<a name="4.9.0"></a>
# [4.9.0](https://github.com/kazupon/vue-i18n/compare/v4.8.0...v4.9.0) (2016-12-17)


### :bug: Bug Fixes

* **path:** fix nested key translation ([e15ead4](https://github.com/kazupon/vue-i18n/commit/e15ead4)), closes [#97](https://github.com/kazupon/vue-i18n/issues/97)


### :star: New Features

* add globally locale checking ([4cac8b9](https://github.com/kazupon/vue-i18n/commit/4cac8b9))
* locale checking ([#98](https://github.com/kazupon/vue-i18n/issues/98)) by [@long](https://github.com/long)-long-float ([0bc0a6b](https://github.com/kazupon/vue-i18n/commit/0bc0a6b))


<a name="4.8.0"></a>
# [4.8.0](https://github.com/kazupon/vue-i18n/compare/v4.7.4...v4.8.0) (2016-12-08)


### :zap: Improvements

* **extend:** disable no translation warning when set missingHandler ([168a97c](https://github.com/kazupon/vue-i18n/commit/168a97c)), closes [#96](https://github.com/kazupon/vue-i18n/issues/96)



<a name="4.7.4"></a>
## [4.7.4](https://github.com/kazupon/vue-i18n/compare/v4.7.3...v4.7.4) (2016-11-29)


### :bug: Bug Fixes

* **extend:** fix interpolate error [@tariq86](https://github.com/tariq86) ([5f24e17](https://github.com/kazupon/vue-i18n/commit/5f24e17))



<a name="4.7.3"></a>
## [4.7.3](https://github.com/kazupon/vue-i18n/compare/v4.7.2...v4.7.3) (2016-11-24)


### :bug: Bug Fixes

* **extend:** fix array local ([35c268a](https://github.com/kazupon/vue-i18n/commit/35c268a)), closes [#91](https://github.com/kazupon/vue-i18n/issues/91) [#59](https://github.com/kazupon/vue-i18n/issues/59)



<a name="4.7.2"></a>
## [4.7.2](https://github.com/kazupon/vue-i18n/compare/v4.7.1...v4.7.2) (2016-11-19)


### :bug: Bug Fixes

* **observer:** fix dep undefined error ([#88](https://github.com/kazupon/vue-i18n/issues/88)) by [@fandaa](https://github.com/fandaa) ([724974e](https://github.com/kazupon/vue-i18n/commit/724974e)), closes [#88](https://github.com/kazupon/vue-i18n/issues/88)


### :zap: Improvements

* **extend:** support translate empty string ([#86](https://github.com/kazupon/vue-i18n/issues/86)) by [@QingWei](https://github.com/QingWei)-Li ([8e6d154](https://github.com/kazupon/vue-i18n/commit/8e6d154))



<a name="4.7.1"></a>
## [4.7.1](https://github.com/kazupon/vue-i18n/compare/v4.7.0...v4.7.1) (2016-10-29)


### :bug: Bug Fixes

* **interpolate:** named formatting: use name if value is missing ([#77](https://github.com/kazupon/vue-i18n/issues/77)) by [@SebastianS90](https://github.com/SebastianS90) ([a0cc343](https://github.com/kazupon/vue-i18n/commit/a0cc343))


### :zap: Improvements

* **named:** using default use nmae when value is missing ([c34e8f1](https://github.com/kazupon/vue-i18n/commit/c34e8f1))



<a name="4.7.0"></a>
# [4.7.0](https://github.com/kazupon/vue-i18n/compare/v4.6.0...v4.7.0) (2016-10-28)


### :star: New Features

* hot reloading ([#71](https://github.com/kazupon/vue-i18n/issues/71)) by [@gglnx](https://github.com/gglnx) ([7bb94ac](https://github.com/kazupon/vue-i18n/commit/7bb94ac))


### :zap: Improvements

* **pluralization:** zero choice ([#70](https://github.com/kazupon/vue-i18n/issues/70)) by [@sebwas](https://github.com/sebwas) ([5f0004f](https://github.com/kazupon/vue-i18n/commit/5f0004f))



<a name="4.6.0"></a>
# [4.6.0](https://github.com/kazupon/vue-i18n/compare/v4.5.0...v4.6.0) (2016-09-24)


### :star: New Features

* **config:** custom message formatter ([#57](https://github.com/kazupon/vue-i18n/issues/57)) by [@jvmccarthy](https://github.com/jvmccarthy) ([2748eb4](https://github.com/kazupon/vue-i18n/commit/2748eb4))



<a name="4.5.0"></a>
# [4.5.0](https://github.com/kazupon/vue-i18n/compare/v4.4.1...v4.5.0) (2016-09-15)


### :star: New Features

* **config:** translation miss capturing configration ([aca0ed6](https://github.com/kazupon/vue-i18n/commit/aca0ed6)), closes [#54](https://github.com/kazupon/vue-i18n/issues/54)



<a name="4.4.1"></a>
## [4.4.1](https://github.com/kazupon/vue-i18n/compare/v4.4.0...v4.4.1) (2016-09-10)


### :zap: Improvements

* **translate:** support hyphenated key ([#52](https://github.com/kazupon/vue-i18n/issues/52)) by [@tariq86](https://github.com/tariq86) ([a40acfd](https://github.com/kazupon/vue-i18n/commit/a40acfd))



<a name="4.4.0"></a>
# [4.4.0](https://github.com/kazupon/vue-i18n/compare/v4.3.1...v4.4.0) (2016-08-29)


### :star: New Features

* add linked translations ([#50](https://github.com/kazupon/vue-i18n/issues/50)) by [@mmochetti](https://github.com/mmochetti) ([f7ae073](https://github.com/kazupon/vue-i18n/commit/f7ae073))



<a name="4.3.1"></a>
## [4.3.1](https://github.com/kazupon/vue-i18n/compare/v4.3.0...v4.3.1) (2016-08-26)


### :bug: Bug Fixes

* **npm:** fix installing bug ([57e66aa](https://github.com/kazupon/vue-i18n/commit/57e66aa)), closes [#46](https://github.com/kazupon/vue-i18n/issues/46)



<a name="4.3.0"></a>
# [4.3.0](https://github.com/kazupon/vue-i18n/compare/v4.2.3...v4.3.0) (2016-08-26)


### :star: New Features

* add pluralization ([#44](https://github.com/kazupon/vue-i18n/issues/44)) by [@mmochetti](https://github.com/mmochetti) ([b5b84d8](https://github.com/kazupon/vue-i18n/commit/b5b84d8))



<a name="4.2.3"></a>
## [4.2.3](https://github.com/kazupon/vue-i18n/compare/v4.2.2...v4.2.3) (2016-08-23)


### :chart_with_upwards_trend: Performance Fixes

* improve re-rendering cost when change the lang ([0707338](https://github.com/kazupon/vue-i18n/commit/0707338))



<a name="4.2.2"></a>
## [4.2.2](https://github.com/kazupon/vue-i18n/compare/v4.2.1...v4.2.2) (2016-08-15)


### :bug: Bug Fixes

* **path:** fix array path syntax error ([bc9dbee](https://github.com/kazupon/vue-i18n/commit/bc9dbee)), closes [#42](https://github.com/kazupon/vue-i18n/issues/42) [#43](https://github.com/kazupon/vue-i18n/issues/43)



<a name="4.2.1"></a>
## [4.2.1](https://github.com/kazupon/vue-i18n/compare/v4.2.0...v4.2.1) (2016-08-13)


### :zap: Improvements

* **translate:** fallback translation warning ([5f6b271](https://github.com/kazupon/vue-i18n/commit/5f6b271))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/kazupon/vue-i18n/compare/v4.1.0...v4.2.0) (2016-08-12)


### :chart_with_upwards_trend: Performance Fixes

* **format:** use hasOwn function of Vue.util ([a8a19a0](https://github.com/kazupon/vue-i18n/commit/a8a19a0))


### :star: New Features

* **fallback:** add fallback translation feature ([1d1f0f2](https://github.com/kazupon/vue-i18n/commit/1d1f0f2)), closes [#36](https://github.com/kazupon/vue-i18n/issues/36)



<a name="4.1.0"></a>
# [4.1.0](https://github.com/kazupon/vue-i18n/compare/v4.0.1...v4.1.0) (2016-07-25)


### :bug: Bug Fixes

* **util:** fixed isArray reference errors ([0c6f6a0](https://github.com/kazupon/vue-i18n/commit/0c6f6a0))


### :star: New Features

* support vue 2.0.0.beta later ([0e1d2f7](https://github.com/kazupon/vue-i18n/commit/0e1d2f7))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/kazupon/vue-i18n/compare/v4.0.0...v4.0.1) (2016-06-06)


### :bug: Bug Fixes

* **translate:** fix underscore named argument translate issue ([eeaf936](https://github.com/kazupon/vue-i18n/commit/eeaf936))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/kazupon/vue-i18n/compare/v3.1.1...v4.0.0) (2016-05-10)


### :zap: Improvements

* support vue 2.0-pre-alpha ([f6517bc](https://github.com/kazupon/vue-i18n/commit/f6517bc))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/kazupon/vue-i18n/compare/v3.1.0...v3.1.1) (2016-05-09)


### :star: New Features

* auto installation for standalone ([2b0dc09](https://github.com/kazupon/vue-i18n/commit/2b0dc09))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/kazupon/vue-i18n/compare/v3.0.0...v3.1.0) (2016-05-09)


### :star: New Features

* component locales ([12fe695](https://github.com/kazupon/vue-i18n/commit/12fe695)), closes [#29](https://github.com/kazupon/vue-i18n/issues/29)


### :warning: Depcreted

* **options:** remove Vue.use options ([d87b59b](https://github.com/kazupon/vue-i18n/commit/d87b59b))


### :zap: Improvements

* **keypath:** port the object path parser ([3ae04b7](https://github.com/kazupon/vue-i18n/commit/3ae04b7))
* **translation:** fix hypenate included key translating ([d0a415f](https://github.com/kazupon/vue-i18n/commit/d0a415f)), closes [#24](https://github.com/kazupon/vue-i18n/issues/24)
* **translation:** warning outputing when cannot translate with keypath ([b4c7c0e](https://github.com/kazupon/vue-i18n/commit/b4c7c0e)), closes [#22](https://github.com/kazupon/vue-i18n/issues/22)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/kazupon/vue-i18n/compare/v2.4.1...v3.0.0) (2016-04-18)


### Features

* **lang:** support lang reactive changing ([203ee85](https://github.com/kazupon/vue-i18n/commit/203ee85)), closes [#2](https://github.com/kazupon/vue-i18n/issues/2) [#15](https://github.com/kazupon/vue-i18n/issues/15)
* **locale:** support dynamic local ([4d61e8d](https://github.com/kazupon/vue-i18n/commit/4d61e8d)), closes [#6](https://github.com/kazupon/vue-i18n/issues/6) [#21](https://github.com/kazupon/vue-i18n/issues/21)

### DEPRECATED

* **index:** plugin install `Vue.use` options (`options.locales`, `options.lang`). See [README](https://github.com/kazupon/vue-i18n/blob/dev/README.md)
    

<a name="2.4.1"></a>
## [2.4.1](https://github.com/kazupon/vue-i18n/compare/v2.4.0...v2.4.1) (2016-02-29)

### Features

* **i18n:** support ruby on rails i18n interpolation format ([b6b2490](https://github.com/kazupon/vue-i18n/commit/b6b2490))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/kazupon/vue-i18n/compare/v2.3.3...v2.4.0) (2016-02-06)


### Features

* **i18n:** add Vue.t function ([68935e3](https://github.com/kazupon/vue-i18n/commit/68935e3)), closes [#17](https://github.com/kazupon/vue-i18n/issues/17)



<a name="2.3.3"></a>
## [2.3.3](https://github.com/kazupon/vue-i18n/compare/v2.3.2...v2.3.3) (2015-12-09)


### Bug Fixes

* **npm:** npm install error ([e31e89e](https://github.com/kazupon/vue-i18n/commit/e31e89e))

### Features

* **bower:** good-bye bower :wink: ([d99eb15](https://github.com/kazupon/vue-i18n/commit/d99eb15))


### BREAKING CHANGES

* bower: not support `bower` package manager

I think that bower is dead. :no_good:



<a name="2.3.2"></a>
## [2.3.2](https://github.com/kazupon/vue-i18n/compare/v2.3.1...v2.3.2) (2015-12-09)


### Features

* **bundle:** more compact the vue-i18n distribution file ([2f32ecc](https://github.com/kazupon/vue-i18n/commit/2f32ecc))



<a name="2.3.1"></a>
## [2.3.1](https://github.com/kazupon/vue-i18n/compare/v2.3.0...v2.3.1) (2015-12-01)

### Reverts

* **index:** automatically install for standalone ([25b8059](https://github.com/kazupon/vue-i18n/commit/25b8059))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/kazupon/vue-i18n/compare/v2.2.0...v2.3.0) (2015-11-26)


### Bug Fixes

* **index:** cannot work at Vue 1.0.10 later ([6fd543e](https://github.com/kazupon/vue-i18n/commit/6fd543e)), closes [#9](https://github.com/kazupon/vue-i18n/issues/9)

### Features

* **index:** support automatically install for standalone ([ada2673](https://github.com/kazupon/vue-i18n/commit/ada2673))



# v2.2.0 / 2015-09-16

* Re-implemetation with ES6 (babel)

# v2.1.0 / 2015-07-03

* Add global local language setting with `Vue.config.lang`

# v2.0.0 / 2015-06-29

* Support Vue.js 0.12
* Remove the followings (Breaking Changes)
    * `Vue.t` function
    * `v-t` directive

# v1.1.1 / 2015-04-21

* Fix unit test error

# v1.1.0 / 2015-01-10

* Support template string in `$t` method
* Support language changing in `$t` method

# v1.0.0 / 2015-01-10

* Add `$t` method

# v0.11.0 / 2014-11-07

* Bump to 0.11.0

# v0.2.0 / 2014-10-08

* Support Vue.js 0.11.0-rc

# v0.1.2 / 2014-10-07

* Support bower

# v0.1.1 / 2014-10-06

* Add `Vue.t` function

# v0.1.0 / 2014-05-06

* Release first

# v0.0.0 / 2014-05-03

* Initial project
