"use strict";

const ensureIterable      = require("type/iterable/ensure")
    , isPlainFunction     = require("type/plain-function/is")
    , ensurePlainFunction = require("type/plain-function/ensure")
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
	const original = process.env;
	const counterpart = createEnv();
	if (options.asCopy) Object.assign(counterpart, original);
	if (options.whitelist) {
		for (const varName of ensureIterable(options.whitelist, {
			errorMessage: "options.whitelist expected to be an iterable, got %v"
		})) {
			if (objHasOwnProperty.call(original, varName)) counterpart[varName] = original[varName];
		}
	}
	process.env = counterpart;
	const restore = () => (process.env = original);

	if (!callback) return { originalEnv: original, restoreEnv: restore };
	return processCallback(callback, original, restore);
};
