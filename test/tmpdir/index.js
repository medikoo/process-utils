"use strict";

const test                 = require("tape")
    , fs                   = require("fs").promises
    , os                   = require("os")
    , resolveProcessTmpdir = require("../../tmpdir");

test("tmpdir", async t => {
	const processTmpDir = await resolveProcessTmpdir();

	t.equal(
		processTmpDir.startsWith(os.tmpdir()), true,
		"Should be placed in context of system temp dir"
	);
	const stats = await fs.stat(processTmpDir);

	t.equal(stats.isDirectory(), true, "Should be a directory");

	t.end();
});
