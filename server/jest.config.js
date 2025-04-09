module.exports = {
    collectCoverageFrom: [
      "**/*.{js,jsx}",
      "!**/node_modules/**",
      "!**/seeds/**",          // Ignore seeds
      "!**/migrations/**",     // Optional: ignore migration files too
      "!**/knexfile.js",       // Optional: ignore knex config
      "!**/jest.config.js",
    ],
  };
