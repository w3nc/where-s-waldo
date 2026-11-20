// Shared test helpers. Not a test file itself (Jest only runs *.test.js).
const prisma = require('../db/client');

const CHARACTERS = [
  { name: 'Waldo', x: 0.6343, y: 0.874, radius: 0.02 },
  { name: 'Wizard', x: 0.7807, y: 0.5775, radius: 0.02 },
  { name: 'Wilma', x: 0.3085, y: 0.6423, radius: 0.02 },
];

// Keeps the 3 characters in place; only games and scores are cleared.
async function seedCharacters() {
  for (const c of CHARACTERS) {
    await prisma.character.upsert({
      where: { name: c.name },
      update: { x: c.x, y: c.y, radius: c.radius },
      create: c,
    });
  }
}

async function resetGames() {
  await prisma.$transaction([prisma.score.deleteMany(), prisma.game.deleteMany()]);
}

// A click exactly on each character's centre.
function centreOf(name) {
  const c = CHARACTERS.find((ch) => ch.name === name);
  return { x: c.x, y: c.y };
}

// Sends a correct guess for all three characters through the API.
async function findEveryone(request, gameId) {
  let last;
  for (const c of CHARACTERS) {
    last = await request.post(`/game/${gameId}/guess`).send({ character: c.name, ...centreOf(c.name) });
  }
  return last;
}

module.exports = { prisma, CHARACTERS, seedCharacters, resetGames, centreOf, findEveryone };
