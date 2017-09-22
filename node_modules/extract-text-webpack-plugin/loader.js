/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var fs = require("fs");
var loaderUtils = require("loader-utils");
var NodeTemplatePlugin = require("webpack/lib/node/NodeTemplatePlugin");
var NodeTargetPlugin = require("webpack/lib/node/NodeTargetPlugin");
var LibraryTemplatePlugin = require("webpack/lib/LibraryTemplatePlugin");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
var LimitChunkCountPlugin = require("webpack/lib/optimize/LimitChunkCountPlugin");

var NS = fs.realpathSync(__dirname);

module.exports = function(source) {
	return source;
};

module.exports.pitch = function(request) {
	var query = loaderUtils.getOptions(this) || {};
	var loaders = this.loaders.slice(this.loaderIndex + 1);
	this.addDependency(this.resourcePath);
	// We already in child compiler, return empty bundle
	if(this[NS] === undefined) {
		throw new Error(
			'"extract-text-webpack-plugin" loader is used without the corresponding plugin, ' +
			'refer to https://github.com/webpack/extract-text-webpack-plugin for the usage example'
		);
	} else if(this[NS] === false) {
		return "";
	} else if(this[NS](null, query)) {
		if(query.omit) {
			this.loaderIndex += +query.omit + 1;
			request = request.split("!").slice(+query.omit).join("!");
			loaders = loaders.slice(+query.omit);
		}
		var resultSource;
		if(query.remove) {
			resultSource = "// removed by extract-text-webpack-plugin";
		} else {
			resultSource = undefined;
		}

		var childFilename = "extract-text-webpack-plugin-output-filename"; // eslint-disable-line no-path-concat
		var publicPath = typeof query.publicPath === "string" ? query.publicPath : this._compilation.outputOptions.publicPath;
		var outputOptions = {
			filename: childFilename,
			publicPath: publicPath
		};
		var childCompiler = this._compilation.createChildCompiler("extract-text-webpack-plugin", outputOptions);
		childCompiler.apply(new NodeTemplatePlugin(outputOptions));
		childCompiler.apply(new LibraryTemplatePlugin(null, "commonjs2"));
		childCompiler.apply(new NodeTargetPlugin());
		childCompiler.apply(new SingleEntryPlugin(this.context, "!!" + request));
		childCompiler.apply(new LimitChunkCountPlugin({ maxChunks: 1 }));
		var subCache = "subcache " + NS + " " + request; // eslint-disable-line no-path-concat
		childCompiler.plugin("compilation", function(compilation) {
			if(compilation.cache) {
				if(!compilation.cache[subCache])
					compilation.cache[subCache] = {};
				compilation.cache = compilation.cache[subCache];
			}
		});
		// We set loaderContext[NS] = false to indicate we already in
		// a child compiler so we don't spawn another child compilers from there.
		childCompiler.plugin("this-compilation", function(compilation) {
			compilation.plugin("normal-module-loader", function(loaderContext, module) {
				loaderContext[NS] = false;
				if (module.request === request) {
					module.loaders = loaders.map(function(loader) {
						return {
							loader: loader.path,
							options: loader.options
						};
					});
				}
			});
		});

		var source;
		childCompiler.plugin("after-compile", function(compilation, callback) {
			source = compilation.assets[childFilename] && compilation.assets[childFilename].source();

			// Remove all chunk assets
			compilation.chunks.forEach(function(chunk) {
				chunk.files.forEach(function(file) {
					delete compilation.assets[file];
				});
			});

			callback();
		});
		var callback = this.async();
		childCompiler.runAsChild(function(err, entries, compilation) {
			if(err) return callback(err);

			if(compilation.errors.length > 0) {
				return callback(compilation.errors[0]);
			}
			compilation.fileDependencies.forEach(function(dep) {
				this.addDependency(dep);
			}, this);
			compilation.contextDependencies.forEach(function(dep) {
				this.addContextDependency(dep);
			}, this);
			if(!source) {
				return callback(new Error("Didn't get a result from child compiler"));
			}
			try {
				var text = this.exec(source, request);
				if(typeof text === "string")
					text = [[0, text]];
				text.forEach(function(item) {
					var id = item[0];
					compilation.modules.forEach(function(module) {
						if(module.id === id)
							item[0] = module.identifier();
					});
				});
				this[NS](text, query);
				if(text.locals && typeof resultSource !== "undefined") {
					resultSource += "\nmodule.exports = " + JSON.stringify(text.locals) + ";";
				}
			} catch(e) {
				return callback(e);
			}
			if(resultSource)
				callback(null, resultSource);
			else
				callback();
		}.bind(this));
	}
};
