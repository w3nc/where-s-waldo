import { formatTime } from '../format.js';

// Sidebar list of the 10 fastest times, shown under the WANTED card.
export default function TopScores({ scores, myScoreId }) {
  return (
    <section className="paper top-scores" aria-labelledby="top-scores-title">
      <h2 id="top-scores-title" className="top-scores-title">Leaderboard</h2>
      {scores.length === 0 ? (
        <p className="top-scores-empty">No scores yet. Be the first!</p>
      ) : (
        <ol className="top-scores-list">
          {scores.map((s, i) => (
            <li key={s.id} className={`top-scores-item${s.id === myScoreId ? ' is-mine' : ''}`}>
              <span className="top-scores-rank" aria-hidden="true">{i + 1}.</span>
              <span className="top-scores-name">{s.name}</span>
              <span className="top-scores-time">{formatTime(s.timeMs)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
