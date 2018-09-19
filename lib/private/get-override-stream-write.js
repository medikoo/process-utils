"use strict";

const ensurePlainFunction = require("es5-ext/object/ensure-plain-function");

module.exports = type => customWrite => {
	const stream = process[`std${ type }`];
	ensurePlainFunction(customWrite);
	const originalWrite = stream.write;
	const superWrite = originalWrite.bind(stream);
	stream.write = function (data) { return customWrite.call(this, data, superWrite); };
	return {
		[`superStd${ type }Write`]: superWrite,
		[`originalStd${ type }Write`]: originalWrite,
		[`restoreStd${ type }Write`]: () => (stream.write = originalWrite)
	};
};
