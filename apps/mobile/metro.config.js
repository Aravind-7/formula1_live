const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Monorepo: Metro needs to watch the workspace root (so it sees changes in
// packages/*) and resolve node_modules from both the project and the
// hoisted workspace root, since our shared packages live outside apps/mobile.
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// NOT disableHierarchicalLookup: pnpm nests transitive deps (e.g.
// nativewind's own dependency on react-native-css-interop) inside its
// .pnpm store, reachable only via normal upward directory traversal —
// disabling that breaks resolution of any nested package's own dependencies.

module.exports = withNativeWind(config, { input: "./global.css" });
