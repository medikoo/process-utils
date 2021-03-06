"use strict";

const test = require("tape");

module.exports = (type, overrideStream) =>
	test(`overrideStd${ type }Write`, t => {
		t.test("Bare", t => {
			const stream = process[`std${ type }`];
			const { write } = stream;
			let data, passedWrite;
			const result = overrideStream((chunk, writeToOriginal) => {
				data = chunk;
				passedWrite = writeToOriginal;
				return true;
			});
			const originalStdWrite = result[`originalStd${ type }Write`];
			const { originalWrite } = result;
			const restoreWrite = result[`restoreStd${ type }Write`];
			const overridenWrite = stream.write;
			stream.write("Foo\nBar");
			restoreWrite();
			t.notEqual(write, overridenWrite, "Should override write");
			t.equal(originalWrite, write, "Should expose overriden method");
			t.equal(data, "Foo\nBar", "Should override with passed function");
			t.equal(passedWrite, originalStdWrite, "Should pass direct write function");
			t.equal(stream.write, write, "Should restore original write");
			t.end();
		});
		t.test("Callback", t => {
			const stream = process[`std${ type }`];
			const { write } = stream;
			let data, passedWrite, originalStdWrite, originalWrite, overridenWrite;
			overrideStream(
				(chunk, writeToOriginal) => {
					data = chunk;
					passedWrite = writeToOriginal;
					return true;
				},
				(originalStdWriteInput, originalWriteInput) => {
					originalStdWrite = originalStdWriteInput;
					originalWrite = originalWriteInput;
					overridenWrite = stream.write;
					stream.write("Foo\nBar");
				}
			);
			t.notEqual(write, overridenWrite, "Should override write");
			t.equal(originalWrite, write, "Should expose overriden method");
			t.equal(passedWrite, originalStdWrite, "Should pass direct write function");
			t.equal(data, "Foo\nBar", "Should override with passed function");
			t.equal(stream.write, write, "Should restore original write");
			t.end();
		});
		t.end();
	});
