// Runs once before the tests. Loads server/.env and forces the test setting,
// so the tests can never fall back to the normal database.
const loadEnv = require('../utils/loadEnv');

module.exports = async function globalSetup() {
  loadEnv();
  process.env.NODE_ENV = 'test';

  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl) {
    throw new Error('TEST_DATABASE_URL is missing. Add it to server/.env.');
  }
  if (testUrl === process.env.DATABASE_URL) {
    throw new Error('TEST_DATABASE_URL must not be the same as DATABASE_URL.');
  }
  if (!testUrl.includes('test')) {
    throw new Error('TEST_DATABASE_URL should point at a database named test_wheres_waldo.');
  }
};
