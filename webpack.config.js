const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@nozbe/watermelondb']
    }
  }, argv);
  
  // Add fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": false,
    "os": false,
    "crypto": false
  };

  // Configure webpack to ignore SQLite-related modules on web
  config.resolve.alias = {
    ...config.resolve.alias,
    '@nozbe/watermelondb/adapters/sqlite': '@nozbe/watermelondb/adapters/lokijs'
  };

  // Ignore node-specific SQLite modules
  config.externals = [
    ...(config.externals || []),
    'better-sqlite3',
    '@journeyapps/sqlcipher'
  ];
  
  return config;
};