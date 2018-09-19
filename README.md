[![*nix build status][nix-build-image]][nix-build-url]
[![Windows build status][win-build-image]][win-build-url]
[![Tests coverage][cov-image]][cov-url]
![Transpilation status][transpilation-image]
[![npm version][npm-image]][npm-url]

# process-utils

## Utilities for [Node.js `process`](https://nodejs.org/api/process.html) handling

### Installation

```bash
npm install process-utils
```

### Available utilities

#### `override-env`

Overrides `process.env` for time of callback invocation. Helpful when testing modules which behavior
relies on environment settings.

```javascript
const overrideEnv = require("process-utls/override-env");

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

### Tests

```bash
npm test
```

[nix-build-image]: https://semaphoreci.com/api/v1/medikoo-org/process-utils/branches/master/shields_badge.svg
[nix-build-url]: https://semaphoreci.com/medikoo-org/process-utils
[win-build-image]: https://ci.appveyor.com/api/projects/status/mgttc0h68grk2i6s?svg=true
[win-build-url]: https://ci.appveyor.com/api/projects/status/mgttc0h68grk2i6s
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/process-utils.svg
[cov-url]: https://codecov.io/gh/medikoo/process-utils
[transpilation-image]: https://img.shields.io/badge/transpilation-free-brightgreen.svg
[npm-image]: https://img.shields.io/npm/v/process-utils.svg
[npm-url]: https://www.npmjs.com/package/process-utils
