"use strict";

const test        = require("tape")
    , overrideEnv = require("../override-env");

test("overrideEnv", t => {
	const { env } = process;
	env.FOO = "bar";
	const { restoreEnv, originalEnv } = overrideEnv();
	t.notEqual(process.env, env, "Should override env");
	t.equal(process.env.FOO, undefined, "Should not copy existing variables");
	t.equal(originalEnv, env, "Should expose original env at original env property");
	restoreEnv();
	t.equal(process.env, env, "Should restore original env after calling a callback");
	delete env.FOO;
	t.end();
});
