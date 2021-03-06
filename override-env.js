"use strict";

const isPlainFunction     = require("type/plain-function/is")
    , ensurePlainFunction = require("type/plain-function/ensure")
    , ensurePlainObject   = require("type/plain-object/ensure")
    , processCallback     = require("./lib/private/process-callback")
    , createEnv           = require("./create-env");

module.exports = (options = {}, callback = null) => {
	ensurePlainFunction(callback, { isOptional: true });
	if (!callback && isPlainFunction(options)) {
		callback = options;
		options = {};
	} else {
		options = ensurePlainObject(options, { default: {}, name: "options" });
	}
	const original = process.env;
	const replacement = createEnv(options);
	process.env = replacement;
	const restore = () => (process.env = original);

	if (!callback) return { originalEnv: original, restoreEnv: restore };
	return processCallback(callback, [original], restore);
};
