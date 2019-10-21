"use strict";

const ensureIterable      = require("type/iterable/ensure")
    , isPlainFunction     = require("type/plain-function/is")
    , ensurePlainFunction = require("type/plain-function/ensure")
    , ensureString        = require("type/string/ensure")
    , isObject            = require("type/object/is")
    , processCallback     = require("./lib/private/process-callback")
    , createEnv           = require("./create-env");

const { hasOwnProperty: objHasOwnProperty } = Object.prototype;

module.exports = (options = {}, callback = null) => {
	ensurePlainFunction(callback, { isOptional: true });
	if (!callback && isPlainFunction(options)) {
		callback = options;
		options = {};
	} else if (!isObject(options)) {
		options = {};
	}
	if (options.asCopy && options.whitelist) {
		throw new Error("Either `asCopy` or `whitelist` option is expected by not both");
	}
	const whitelist = ensureIterable(options.whitelist, {
		isOptional: true,
		ensureItem: ensureString,
		errorMessage: "`whitelist` expected to be a string collection, got %v"
	});
	const original = process.env;
	const counterpart = createEnv();
	if (options.asCopy) Object.assign(counterpart, original);
	if (whitelist) {
		for (const varName of whitelist) {
			if (objHasOwnProperty.call(original, varName)) counterpart[varName] = original[varName];
		}
	}
	process.env = counterpart;
	const restore = () => (process.env = original);

	if (!callback) return { originalEnv: original, restoreEnv: restore };
	return processCallback(callback, original, restore);
};
