"use strict";

const ensurePlainFunction = require("type/plain-function/ensure")
    , processCallback     = require("./process-callback");

module.exports = type => (customWrite, callback = null) => {
	console.error("PUOS: Ensure function v2");
	ensurePlainFunction(callback, { isOptional: true });
	console.error("PUOS: Retrieve stream");
	const stream = process[`std${ type }`];
	console.error("PUOS: Ensure function #2");
	ensurePlainFunction(customWrite);
	console.error("PUOS: Retrieve stream.write");
	const originalWrite = stream.write;
	console.error("PUOS: Bind stream.write");
	const originalStdWrite = originalWrite.bind(stream);
	console.error("PUOS: Overwrite stream.write");
	stream.write = function (data) { return customWrite.call(this, data, originalStdWrite); };
	console.error("PUOS: Overriden");
	const restore = () => (stream.write = originalWrite);
	if (!callback) {
		return {
			[`originalStd${ type }Write`]: originalStdWrite,
			originalWrite,
			[`restoreStd${ type }Write`]: restore
		};
	}
	console.error("PUOS: Process callback");
	return processCallback(callback, [originalStdWrite, originalWrite], restore);
};
