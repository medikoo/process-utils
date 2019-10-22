"use strict";

const test      = require("tape")
    , isObject  = require("type/object/is")
    , createEnv = require("../create-env");

test("createEnv", t => {
	let env = createEnv();

	t.equal(isObject(env), true, "Should create object");
	t.equal(Object.keys(env).length, 0, "Should create empty object");

	env.marko = null;
	t.equal(env.marko, "null", "Should automatically stringify set properties");
	Object.defineProperty(env, "hola", { value: 34 });
	t.deepEqual(
		Object.getOwnPropertyDescriptor(env, "hola"),
		{ configurable: true, enumerable: true, value: "34", writable: true },
		"Should override property definitions"
	);

	process.env.BAR = "elo";
	t.equal(env.BAR, undefined, "Should not leak new process.env vars on created env");
	delete process.env.BAR;

	t.test("`whitelist` option", t => {
		process.env.FOO = "bar";
		process.env.LOREM = "ispum";
		try {
			env = createEnv({ whitelist: ["FOO", "MARKO"] });
			t.equal(env.FOO, "bar", "Should expose whitelisted variables");
			t.equal(env.LOREM, undefined, "Should not expose not whitelisted variables");
			t.equal(
				env.MARKO, undefined,
				"Should not try to assign not existing but whitelisted variables"
			);
		} finally {
			delete process.env.FOO;
			delete process.env.LOREM;
		}
		t.end();
	});

	t.test("`asCopy` option", t => {
		process.env.FOO = "bar";
		try {
			env = createEnv({ asCopy: true });
			t.equal(env.FOO, "bar", "Should copy existing variables");
		} finally {
			delete process.env.FOO;
		}
		t.end();
	});

	t.test("`variables` option", t => {
		process.env.FOO = "bar";
		try {
			env = createEnv({ variables: { MARKO: 12 } });
			t.equal(env.FOO, undefined, "Should not expose process.env vars");
			t.equal(env.MARKO, "12", "Should copy option.variables onto new process.env");
		} finally {
			delete process.env.FOO;
		}
		t.end();
	});

	t.end();
});
