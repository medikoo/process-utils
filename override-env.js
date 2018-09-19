"use strict";

module.exports = () => {
	const cache = process.env;
	process.env = {};
	return { originalEnv: cache, restoreEnv: () => (process.env = cache) };
};
