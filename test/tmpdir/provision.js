"use strict";

const test                 = require("tape")
    , fs                   = require("fs").promises
    , resolveProcessTmpDir = require("../../tmpdir")
    , provisionTmpdir      = require("../../tmpdir/provision");

test("tmpdir/provision", async t => {
	const processTmpdir = await resolveProcessTmpDir();
	const provisionedTmpdir = await provisionTmpdir();

	t.equal(
		provisionedTmpdir.startsWith(processTmpdir), true,
		"Should be placed in context of process temp dir"
	);
	t.equal(provisionedTmpdir === processTmpdir, false, "Should not be equal to process tmpdir");
	const stats = await fs.stat(provisionedTmpdir);

	t.equal(stats.isDirectory(), true, "Should be a directory");

	t.end();
});
