// Talks to the Express server. In development, Vite forwards /game and /scores
// to http://localhost:3001 (see vite.config.js), so no address is needed here.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body; handled below.
  }
  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
  }
  return data;
}

export function startGame() {
  return request('/game/start', { method: 'POST' });
}

export function guessCharacter(gameId, { character, x, y }) {
  return request(`/game/${gameId}/guess`, {
    method: 'POST',
    body: JSON.stringify({ character, x, y }),
  });
}

export function saveScore(gameId, name) {
  return request(`/game/${gameId}/score`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function fetchScores() {
  return request('/scores');
}
