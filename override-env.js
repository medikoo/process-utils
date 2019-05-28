"use strict";

const isPlainFunction = require("type/plain-function/is")
    , isObject        = require("type/object/is")
    , ensureObject    = require("type/object/ensure")
    , isThenable      = require("type/thenable/is");

module.exports = (options = {}, callback = null) => {
	if (isPlainFunction(options)) {
		callback = options;
		options = {};
	} else if (!isObject(options)) {
		options = {};
	}
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
	const restoreEnv = () => (process.env = cache);

	if (!callback) return { originalEnv: cache, restoreEnv };

	let result;
	try {
		result = callback(cache);
	} catch (error) {
		restoreEnv();
		throw error;
	}
	if (!isThenable(result)) {
		restoreEnv();
		return result;
	}
	return result.then(
		resolvedResult => {
			restoreEnv();
			return resolvedResult;
		},
		error => {
			restoreEnv();
			throw error;
		}
	);
};
