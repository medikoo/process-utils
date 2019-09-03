"use strict";

const ensureIterable      = require("type/iterable/ensure")
    , isPlainFunction     = require("type/plain-function/is")
    , ensurePlainFunction = require("type/plain-function/ensure")
    , isObject            = require("type/object/is")
    , ensureObject        = require("type/object/ensure")
    , processCallback     = require("./lib/private/process-callback");

const { hasOwnProperty: objHasOwnProperty } = Object.prototype;

module.exports = (options = {}, callback = null) => {
	ensurePlainFunction(callback, { isOptional: true });
	if (!callback && isPlainFunction(options)) {
		callback = options;
		options = {};
	} else if (!isObject(options)) {
		options = {};
	}
	const original = process.env;
	const counterpart = {};
	if (options.asCopy) Object.assign(counterpart, original);
	if (options.whitelist) {
		for (const varName of ensureIterable(options.whitelist, {
			errorMessage: "options.whitelist expected to be an iterable, got %v"
		})) {
			if (objHasOwnProperty.call(original, varName)) counterpart[varName] = original[varName];
		}
	}
	process.env = new Proxy(counterpart, {
		defineProperty(target, key, inputDescriptor) {
			return Object.defineProperty(target, key, {
				configurable: true,
				enumerable: true,
				value: `${ ensureObject(inputDescriptor).value }`,
				writable: true
			});
		}
	});
	const restore = () => (process.env = original);

	if (!callback) return { originalEnv: original, restoreEnv: restore };
	return processCallback(callback, original, restore);
};
