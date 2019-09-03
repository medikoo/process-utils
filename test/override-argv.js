"use strict";

const test         = require("tape")
    , overrideArgv = require("../override-argv");

test("overrideArgv", t => {
	const { argv } = process;

	t.test("No option", t => {
		overrideArgv(original => {
			t.notEqual(process.argv, argv, "Should override");
			t.equal(original, argv, "Should expose original");
			t.deepEqual(process.argv, argv.slice(0, 1), "By default should strip argv to one item");
		});
		t.end();
	});

	t.test("Should support sliceAt option", t => {
		overrideArgv({ sliceAt: 2 }, () => { t.deepEqual(process.argv, argv.slice(0, 2)); });
		t.end();
	});

	t.test("Should support args option", t => {
		overrideArgv({ args: ["foo", "bar"] }, () => {
			t.deepEqual(process.argv, argv.slice(0, 1).concat("foo", "bar"));
		});
		t.end();
	});

	t.end();
});
