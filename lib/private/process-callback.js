"use strict";

const isThenable = require("type/thenable/is");

module.exports = (callback, original, restore) => {
	let result;
	try {
		result = callback(original);
	} catch (error) {
		restore();
		throw error;
	}
	if (!isThenable(result)) {
		restore();
		return result;
	}
	return result.then(
		resolvedResult => {
			restore();
			return resolvedResult;
		},
		error => {
			restore();
			throw error;
		}
	);
};
