// Input checks. Each parser returns clean values or throws a 400 AppError.
const { AppError } = require('./errors');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

function isFraction(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function parseGuess(body) {
  const input = body || {};
  const { character, x, y } = input;
  if (typeof character !== 'string' || character.trim() === '') {
    throw new AppError(400, 'character is required');
  }
  if (!isFraction(x) || !isFraction(y)) {
    throw new AppError(400, 'x and y must be numbers between 0 and 1');
  }
  return { character: character.trim(), x, y };
}

function parseName(body) {
  const name = body && typeof body.name === 'string' ? body.name.trim() : '';
  if (name.length < 1 || name.length > 20) {
    throw new AppError(400, 'name must be 1 to 20 characters');
  }
  return name;
}

module.exports = { isUuid, parseGuess, parseName };
