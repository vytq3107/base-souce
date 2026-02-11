// @ts-check
// Bridge for Nx: load ESM flat config (eslint.config.mjs)
module.exports = (async () => (await import('./eslint.config.mjs')).default)();
