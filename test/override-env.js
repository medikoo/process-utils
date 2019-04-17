"use strict";

const test        = require("tape")
    , overrideEnv = require("../override-env");

test("overrideEnv", t => {
	const { env } = process;

	t.test("Bare", t => {
		env.FOO = "bar";
		try {
			const { restoreEnv, originalEnv } = overrideEnv(null);
			t.notEqual(process.env, env, "Should override env");
			t.equal(process.env.FOO, undefined, "Should not copy existing variables");
			t.equal(originalEnv, env, "Should expose original env at original env property");
			process.env.marko = null;
			t.equal(process.env.marko, "null", "Should automatically stringify set properties");
			Object.defineProperty(process.env, "hola", { value: 34 });
			t.deepEqual(
				Object.getOwnPropertyDescriptor(process.env, "hola"),
				{ configurable: true, enumerable: true, value: "34", writable: true },
				"Should override property definitions"
			);
			restoreEnv();
			t.equal(process.env, env, "Should restore original env after calling a callback");
		} finally {
			delete env.FOO;
		}
		t.end();
	});

	t.test("As copy", t => {
		env.FOO = "bar";
		try {
			const { restoreEnv } = overrideEnv({ asCopy: true });
			t.equal(process.env.FOO, "bar", "Should copy existing variables");
			process.env.BAR = "elo";
			t.equal(env.BAR, undefined, "Should not leak new vers on cached env");

			restoreEnv();
		} finally {
			delete env.FOO;
		}
		t.end();
	});

	t.end();
});
