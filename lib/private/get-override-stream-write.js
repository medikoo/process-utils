"use strict";

const ensurePlainFunction = require("es5-ext/object/ensure-plain-function");

module.exports = stream => customWrite => {
	ensurePlainFunction(customWrite);
	const originalWrite = stream.write;
	const write = originalWrite.bind(stream);
	stream.write = function (data) { return customWrite.call(this, data, write); };
	return { write, originalWrite, restoreWrite: () => (stream.write = originalWrite) };
};
