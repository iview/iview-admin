import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

var pkg = require('./package.json')

export default {
	entry: 'index.js',
	moduleName: 'deepmerge',
	plugins: [
		commonjs(),
		resolve()
	],
	targets: [
		{ dest: pkg.main, format: 'umd' },
		{ dest: pkg.module, format: 'es' },
		{ dest: pkg.browser, format: 'cjs' },
	]
}
