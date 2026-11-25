// Expo SDK 52+ configures Metro for monorepos automatically (watchFolders, nodeModulesPaths),
// so the only customisations needed here are the shared-package condition and NativeWind.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Resolve @ecom/shared to its TypeScript source (see packages/shared/package.json "exports").
config.resolver.unstable_conditionNames = [
  '@ecom/source',
  ...(config.resolver.unstable_conditionNames ?? []),
];

module.exports = withNativeWind(config, { input: './src/global.css' });
