"use strict";

const test = require("tape");

module.exports = (type, overrideStream) =>
	test(`overrideStd${ type }Write`, t => {
		const stream = process[`std${ type }`];
		const { write } = stream;
		let data, passedWrite;
		const { write: boundWrite, originalWrite, restoreWrite } = overrideStream(
			(chunk, writeToOriginal) => {
				data = chunk;
				passedWrite = writeToOriginal;
				return true;
			}
		);
		const overridenWrite = stream.write;
		stream.write("Foo\nBar");
		restoreWrite();
		t.notEqual(write, overridenWrite, "Should override write");
		t.equal(originalWrite, write, "Should expose overriden method");
		t.equal(data, "Foo\nBar", "Should override with passed function");
		t.equal(passedWrite, boundWrite, "Should pass direct write function");
		t.equal(stream.write, write, "Should restore original write");
		t.end();
	});
