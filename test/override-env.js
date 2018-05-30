"use strict";

const test        = require("tape")
    , overrideEnv = require("../override-env");

test("overrideEnv", t => {
	const { env } = process, obj = {};
	let invoked = false;
	env.FOO = "bar";
	t.equal(
		overrideEnv(originalEnv => {
			if (invoked) throw new Error("Should not call callback more than once");
			invoked = true;
			t.notEqual(process.env, env, "Should override env");
			t.equal(process.env.FOO, undefined, "Should not copy existing variables");
			t.equal(originalEnv, env, "Should pass original env as first callback argument");
			return obj;
		}),
		obj,
		"Should return callback value"
	);
	t.equal(invoked, true, "Should invoke callback immediately");
	t.equal(process.env, env, "Should restore original env after calling a callback");
	delete env.FOO;
	const triggerError = new Error("Trigger");
	try {
		overrideEnv(() => { throw triggerError; });
	} catch (error) {
		if (error !== triggerError) throw error;
	}
	t.equal(process.env, env, "Should restore original env if callback crashes");
	t.end();
});
