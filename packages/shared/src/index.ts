// Shared types, constants and zod schemas used by mobile, admin and api.
// Relative imports use explicit `.ts` extensions; tsc rewrites them to `.js` on build
// (rewriteRelativeImportExtensions) so the compiled output runs under plain Node ESM,
// while Metro and Vite consume the .ts source directly.
export * from './constants.ts';
