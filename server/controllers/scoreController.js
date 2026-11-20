const prisma = require('../db/client');

async function getScores(req, res, next) {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { timeMs: 'asc' },
      take: 10,
      select: { id: true, name: true, timeMs: true, createdAt: true },
    });
    res.json(scores);
  } catch (err) {
    next(err);
  }
}

module.exports = { getScores };
