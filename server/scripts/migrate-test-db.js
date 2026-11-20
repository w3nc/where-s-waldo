// Applies the database tables to the TEST database only.
// Run once after creating test_wheres_waldo: npm run db:test:migrate
const { execSync } = require('child_process');
const loadEnv = require('../utils/loadEnv');

loadEnv();

const testUrl = process.env.TEST_DATABASE_URL;
if (!testUrl) {
  console.error('TEST_DATABASE_URL is missing in server/.env');
  process.exit(1);
}

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: testUrl },
});
