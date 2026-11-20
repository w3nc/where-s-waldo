# Where's Waldo? (photo-tagging game)

A Where's Waldo style game. Find Waldo, Wizard and Wilma as fast as you can. Your time is measured on the server and saved to a top-10 board.

Stack: React (Vite) in `/client`, Express + PostgreSQL via Prisma in `/server`, Jest + SuperTest for the server tests.

## 1. Setup

You need Node.js 20.12 or newer and a running PostgreSQL server.

```bash
cd server
npm install
cp .env.example .env        # then edit .env and put your real password in it

cd ../client
npm install
```

Create the two databases in PostgreSQL (with `psql` or pgAdmin):

```sql
CREATE DATABASE wheres_waldo;       -- your normal (development) database
CREATE DATABASE test_wheres_waldo;  -- used ONLY by the tests
```

Then, in `server/`:

```bash
npx prisma migrate dev --name init   # creates the tables in wheres_waldo
npm run db:seed                       # adds Waldo, Wizard and Wilma
```

## 2. Run the game

Open two terminals:

```bash
# terminal 1 - the server (port 3001)
cd server
npm run dev

# terminal 2 - the website (port 5173)
cd client
npm run dev
```

Open http://localhost:5173. The website forwards `/game` and `/scores` to the server.

## 3. Run the tests

The tests use only `TEST_DATABASE_URL`. They never touch your normal database.

```bash
cd server
npm run db:test:migrate   # once: applies the tables to test_wheres_waldo
npm test                  # runs all test files one after another
```

`npm test` runs Jest with `--runInBand`, so the files do not fight over the shared test database. Jest loads `server/.env` first (in `tests/globalSetup.js`), then sets `NODE_ENV=test`, which makes the server use `TEST_DATABASE_URL`.

## 4. Deploy

A simple setup:

1. **Database**: create a hosted PostgreSQL database (for example Neon, Supabase or Railway). Copy its connection string.
2. **Server**: deploy the `server` folder to Render or Railway. Set the environment variables `DATABASE_URL`, `CLIENT_ORIGIN` (your website's address) and `NODE_ENV=production`. The start command is `npm start`. Run `npx prisma migrate deploy` and `npm run db:seed` once against the hosted database.
3. **Website**: deploy the `client` folder to Vercel or Netlify. Build command `npm run build`, output folder `dist`. The site needs to reach the server at the same paths (`/game`, `/scores`). Either add a rewrite rule that forwards those paths to your server, or set the server URL in the client's `src/api.js`.

Never commit `.env` files. Only `.env.example` goes into git.

## Project layout

```
client/   React app (Vite)
server/
  app.js            builds the Express app (no listen, so tests can import it)
  server.js         starts the server
  routes/           URL paths
  controllers/      the logic behind each route
  utils/hitTest.js  pure circle-hit maths (no database)
  db/client.js      Prisma client, picks the database by NODE_ENV
  prisma/           schema and seed
  tests/            Jest + SuperTest tests
```
