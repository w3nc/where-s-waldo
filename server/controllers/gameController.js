const prisma = require('../db/client');
const { isHit } = require('../utils/hitTest');
const { AppError } = require('../utils/errors');
const { isUuid, parseGuess, parseName } = require('../utils/validate');

// Looks up a game by id, or throws 404. Bad ids are treated as "not found".
async function findGameOr404(id) {
  if (!isUuid(id)) throw new AppError(404, 'Game not found');
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game) throw new AppError(404, 'Game not found');
  return game;
}

async function startGame(req, res, next) {
  try {
    const game = await prisma.game.create({ data: {} });
    res.status(201).json({ gameId: game.id });
  } catch (err) {
    next(err);
  }
}

async function makeGuess(req, res, next) {
  try {
    const game = await findGameOr404(req.params.id);
    const { character, x, y } = parseGuess(req.body);

    const target = await prisma.character.findUnique({ where: { name: character } });
    if (!target) throw new AppError(400, 'Unknown character');

    if (!isHit({ x, y }, target)) {
      return res.json({ correct: false, found: game.found });
    }

    // Already found: nothing changes, and the list stays unique.
    if (game.found.includes(character)) {
      return res.json({ correct: true, found: game.found });
    }

    const found = [...game.found, character];
    const total = await prisma.character.count();
    const allFound = found.length >= total;

    const updated = await prisma.game.update({
      where: { id: game.id },
      data: {
        found,
        // The server sets the end time. The client never sends a time.
        ...(allFound ? { endedAt: new Date() } : {}),
      },
    });

    res.json({ correct: true, found: updated.found });
  } catch (err) {
    next(err);
  }
}

async function submitScore(req, res, next) {
  try {
    const game = await findGameOr404(req.params.id);
    const name = parseName(req.body);

    if (!game.endedAt) throw new AppError(403, 'Find all characters before saving a score');

    const existing = await prisma.score.findUnique({ where: { gameId: game.id } });
    if (existing) throw new AppError(409, 'A score was already saved for this game');

    // Time comes only from the server's own clock values.
    const timeMs = game.endedAt.getTime() - game.startedAt.getTime();

    const score = await prisma.score.create({
      data: { name, timeMs, gameId: game.id },
      select: { id: true, name: true, timeMs: true, createdAt: true },
    });

    res.status(201).json(score);
  } catch (err) {
    if (err.code === 'P2002') {
      return next(new AppError(409, 'A score was already saved for this game'));
    }
    next(err);
  }
}

module.exports = { startGame, makeGuess, submitScore };
