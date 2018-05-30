"use strict";

const ensurePlainFunction = require("es5-ext/object/ensure-plain-function");

module.exports = callback => {
	ensurePlainFunction(callback);
	const cache = process.env;
	process.env = {};
	try { return callback(cache); }
	finally { process.env = cache; }
};
