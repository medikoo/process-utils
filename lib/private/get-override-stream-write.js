"use strict";

const ensurePlainFunction = require("type/plain-function/ensure");

module.exports = type => customWrite => {
	const stream = process[`std${ type }`];
	ensurePlainFunction(customWrite);
	const originalWrite = stream.write;
	const originalStdWrite = originalWrite.bind(stream);
	stream.write = function (data) { return customWrite.call(this, data, originalStdWrite); };
	return {
		[`originalStd${ type }Write`]: originalStdWrite,
		originalWrite,
		[`restoreStd${ type }Write`]: () => (stream.write = originalWrite)
	};
};
