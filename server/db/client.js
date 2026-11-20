// Picks the database address by environment, then builds one Prisma client.
// Jest sets NODE_ENV=test, so tests always use TEST_DATABASE_URL.
const { PrismaClient } = require('@prisma/client');

const connectionString =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database URL is missing. Set DATABASE_URL (or TEST_DATABASE_URL in tests) in server/.env');
}

// Prisma 6 does not need a separate adapter: the URL is passed in directly.
const prisma = new PrismaClient({
  datasources: { db: { url: connectionString } },
});

module.exports = prisma;
