"use strict";

const ensureIterable  = require("type/iterable/ensure")
    , isPlainFunction = require("type/plain-function/is")
    , isObject        = require("type/object/is")
    , ensureObject    = require("type/object/ensure")
    , isThenable      = require("type/thenable/is");

const { hasOwnProperty } = Object.prototype;

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
	if (options.whitelist) {
		for (const varName of ensureIterable(options.whitelist, {
			errorMessage: "options.whitelist expected to be an iterable, got %v"
		})) {
			if (hasOwnProperty.call(cache, varName)) baseEnv[varName] = cache[varName];
		}
	}
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
