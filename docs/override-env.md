# `override-env`

Overrides `process.env` until returned `restoreEnv()` is called. Helpful when testing modules which behavior relies on environment settings.

```javascript
const overrideEnv = require("process-utils/override-env");

process.env.FOO = "bar";
const { restoreEnv, originalEnv } = overrideEnv();
// Exposes original `process.env`
console.log(originalEnv.FOO); // "bar";
// Current `process.env` points other (empty plain) object
console.log(process.env.FOO); // undefined;

// Provides a callback to restore previous state
restoreEnv();
console.log(process.env.FOO); // "bar"
```

Optionally _callback_ can be passed to `overrideEnv`, it's invoked immediately, and only for a time of it's execution `process.env` is overriden:

```javascript
const overrideEnv = require("process-utils/override-env");

process.env.FOO = "bar";
// Passed callback is invoked immediately
overrideEnv(originalEnv => {
  // Exposes original `process.env`
  console.log(originalEnv.FOO); // "bar";
  // Current `process.env` points other (empty plain) object
  console.log(process.env.FOO); // undefined;
});
// After return the state is restored
console.log(process.env.FOO); // "bar"
```

However if _callback_ returns _thenable_ then `process.env` is restored when given _thenable_ resolves:

```javascript
const overrideEnv = require("process-utils/override-env");

process.env.FOO = "bar";
overrideEnv(() => new Promise(resolve => setTimeout(resolve, 100)));
// Still process.env is not resolved
console.log(process.env.FOO); // undefined
setTimeout(() => {
  // Original process.env is back
  console.log(process.env.FOO); // "bar"
}, 110);
```

## Supported options

_Same as in [createEnv](create-env.md#supported-options) util_
