const request = require('supertest');
const app = require('../app');
const { prisma, seedCharacters, resetGames, centreOf } = require('./helpers');

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

describe('POST /game/start', () => {
  test('returns a gameId and creates a Game row', async () => {
    const res = await request(app).post('/game/start');

    expect(res.status).toBe(201);
    expect(typeof res.body.gameId).toBe('string');

    const row = await prisma.game.findUnique({ where: { id: res.body.gameId } });
    expect(row).not.toBeNull();
    expect(row.found).toEqual([]);
    expect(row.endedAt).toBeNull();
  });
});

describe('POST /game/:id/guess', () => {
  test('a correct click returns correct:true and adds the character to found', async () => {
    const gameId = await startGame();
    const res = await request(app)
      .post(`/game/${gameId}/guess`)
      .send({ character: 'Waldo', ...centreOf('Waldo') });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ correct: true, found: ['Waldo'] });

    const row = await prisma.game.findUnique({ where: { id: gameId } });
    expect(row.found).toEqual(['Waldo']);
  });

  test('a wrong click returns correct:false and changes nothing', async () => {
    const gameId = await startGame();
    const res = await request(app)
      .post(`/game/${gameId}/guess`)
      .send({ character: 'Waldo', x: 0.05, y: 0.05 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ correct: false, found: [] });

    const row = await prisma.game.findUnique({ where: { id: gameId } });
    expect(row.found).toEqual([]);
  });

  test('an unknown game id returns 404', async () => {
    const res = await request(app)
      .post('/game/00000000-0000-4000-8000-000000000000/guess')
      .send({ character: 'Waldo', ...centreOf('Waldo') });

    expect(res.status).toBe(404);
  });

  test('a malformed game id returns 404', async () => {
    const res = await request(app)
      .post('/game/not-a-uuid/guess')
      .send({ character: 'Waldo', ...centreOf('Waldo') });

    expect(res.status).toBe(404);
  });

  test('x out of the 0-1 range returns 400', async () => {
    const gameId = await startGame();
    const res = await request(app)
      .post(`/game/${gameId}/guess`)
      .send({ character: 'Waldo', x: 1.5, y: 0.5 });

    expect(res.status).toBe(400);
  });

  test('a missing character returns 400', async () => {
    const gameId = await startGame();
    const res = await request(app).post(`/game/${gameId}/guess`).send({ x: 0.5, y: 0.5 });

    expect(res.status).toBe(400);
  });

  test('an unknown character name returns 400', async () => {
    const gameId = await startGame();
    const res = await request(app)
      .post(`/game/${gameId}/guess`)
      .send({ character: 'Odlaw', x: 0.5, y: 0.5 });

    expect(res.status).toBe(400);
  });

  test('finding the same character twice does not duplicate it in found', async () => {
    const gameId = await startGame();
    await request(app).post(`/game/${gameId}/guess`).send({ character: 'Waldo', ...centreOf('Waldo') });
    const res = await request(app)
      .post(`/game/${gameId}/guess`)
      .send({ character: 'Waldo', ...centreOf('Waldo') });

    expect(res.body).toEqual({ correct: true, found: ['Waldo'] });

    const row = await prisma.game.findUnique({ where: { id: gameId } });
    expect(row.found).toEqual(['Waldo']);
  });
});
