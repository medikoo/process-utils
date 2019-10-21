"use strict";

const ensureObject = require("type/object/ensure");

module.exports = () =>
	new Proxy(
		{},
		{
			defineProperty(target, key, inputDescriptor) {
				return Object.defineProperty(target, key, {
					configurable: true,
					enumerable: true,
					value: `${ ensureObject(inputDescriptor).value }`,
					writable: true
				});
			}
		}
	);
