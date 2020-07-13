"use strict";

const ensurePlainFunction = require("type/plain-function/ensure")
    , processCallback     = require("./process-callback");

module.exports = type => (customWrite, callback = null) => {
	console.log("PUOS: Ensure function");
	ensurePlainFunction(callback, { isOptional: true });
	console.log("PUOS: Retrieve stream");
	const stream = process[`std${ type }`];
	console.log("PUOS: Ensure function #2");
	ensurePlainFunction(customWrite);
	console.log("PUOS: Retrieve stream.write");
	const originalWrite = stream.write;
	console.log("PUOS: Bind stream.write");
	const originalStdWrite = originalWrite.bind(stream);
	console.log("PUOS: Overwrite stream.write");
	stream.write = function (data) { return customWrite.call(this, data, originalStdWrite); };
	const restore = () => (stream.write = originalWrite);
	if (!callback) {
		return {
			[`originalStd${ type }Write`]: originalStdWrite,
			originalWrite,
			[`restoreStd${ type }Write`]: restore
		};
	}
	console.log("PUOS: Process callback");
	return processCallback(callback, [originalStdWrite, originalWrite], restore);
};
