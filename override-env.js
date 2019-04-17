"use strict";

const isObject     = require("type/object/is")
    , ensureObject = require("type/object/ensure");

module.exports = (options = {}) => {
	if (!isObject(options)) options = {};
	const cache = process.env;
	const baseEnv = {};
	if (options.asCopy) Object.assign(baseEnv, cache);
	process.env = new Proxy(baseEnv, {
		defineProperty(target, key, inputDescriptor) {
			return Object.defineProperty(target, key, {
				configurable: true,
				enumerable: true,
				value: `${ ensureObject(inputDescriptor).value }`,
				writable: true
			});
		}
	});
	return { originalEnv: cache, restoreEnv: () => (process.env = cache) };
};
