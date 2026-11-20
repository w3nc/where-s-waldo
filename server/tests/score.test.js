const request = require('supertest');
const app = require('../app');
const { prisma, seedCharacters, resetGames, findEveryone } = require('./helpers');

beforeAll(async () => {
  await seedCharacters();
});

beforeEach(async () => {
  await resetGames();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function startGame() {
  const res = await request(app).post('/game/start');
  return res.body.gameId;
}

describe('POST /game/:id/score', () => {
  test('is rejected until all 3 characters are found', async () => {
    const gameId = await startGame();
    await request(app).post(`/game/${gameId}/guess`).send({ character: 'Waldo', x: 0.6343, y: 0.874 });

    const res = await request(app).post(`/game/${gameId}/score`).send({ name: 'Ana' });

    expect(res.status).toBe(403);
    expect(await prisma.score.count()).toBe(0);
  });

  test('works once all 3 are found', async () => {
    const gameId = await startGame();
    await findEveryone(request(app), gameId);

    const res = await request(app).post(`/game/${gameId}/score`).send({ name: 'Ana' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Ana');
    expect(typeof res.body.timeMs).toBe('number');
  });

  test('rejects a second submission for the same game', async () => {
    const gameId = await startGame();
    await findEveryone(request(app), gameId);
    await request(app).post(`/game/${gameId}/score`).send({ name: 'Ana' });

    const res = await request(app).post(`/game/${gameId}/score`).send({ name: 'Ben' });

    expect(res.status).toBe(409);
    expect(await prisma.score.count()).toBe(1);
  });

  test('rejects a name longer than 20 characters', async () => {
    const gameId = await startGame();
    await findEveryone(request(app), gameId);

    const res = await request(app)
      .post(`/game/${gameId}/score`)
      .send({ name: 'x'.repeat(21) });

    expect(res.status).toBe(400);
  });

  test('the saved timeMs comes from the server and ignores a client-sent time', async () => {
    const gameId = await startGame();
    await findEveryone(request(app), gameId);

    const res = await request(app)
      .post(`/game/${gameId}/score`)
      .send({ name: 'Ana', timeMs: 1 });

    expect(res.status).toBe(201);

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    const serverMs = game.endedAt.getTime() - game.startedAt.getTime();

    expect(res.body.timeMs).toBe(serverMs);
    expect(res.body.timeMs).not.toBe(1);

    const saved = await prisma.score.findUnique({ where: { gameId } });
    expect(saved.timeMs).toBe(serverMs);
  });
});

describe('GET /scores', () => {
  test('returns at most 10 entries sorted by fastest time', async () => {
    // Create 12 finished games with known times, in a scrambled order.
    const times = [5000, 1200, 9000, 300, 7000, 2500, 11000, 800, 4000, 6000, 150, 10000];
    for (const [i, timeMs] of times.entries()) {
      const startedAt = new Date('2024-01-01T00:00:00Z');
      const game = await prisma.game.create({
        data: { startedAt, endedAt: new Date(startedAt.getTime() + timeMs), found: ['Waldo', 'Wizard', 'Wilma'] },
      });
      await prisma.score.create({ data: { name: `P${i}`, timeMs, gameId: game.id } });
    }

    const res = await request(app).get('/scores');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(10);

    const returned = res.body.map((s) => s.timeMs);
    const expected = [...times].sort((a, b) => a - b).slice(0, 10);
    expect(returned).toEqual(expected);
  });
});
