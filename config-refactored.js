const CONFIGS = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    timeout: 5000
  },
  testing: {
    apiUrl: 'http://test-server:3000/api',
    debug: true,
    timeout: 5000
  },
  staging: {
    apiUrl: 'https://staging.example.com/api',
    debug: false,
    timeout: 10000
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
    timeout: 15000
  }
};

/**
 * Get environment configuration by key.
 * Defaults to `development` if `env` is falsy or unknown.
 *
 * @param {string} env - Environment name ('development','testing','staging','production')
 * @returns {{apiUrl: string, debug: boolean, timeout: number}}
 */
function getEnvironmentConfig(env = 'development') {
  return CONFIGS[env] || CONFIGS.development;
}

module.exports = getEnvironmentConfig;
