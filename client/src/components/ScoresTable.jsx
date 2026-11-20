import { formatTime } from '../format.js';

export default function ScoresTable({ scores, myScoreId, yourTime, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="paper modal" role="dialog" aria-modal="true" aria-labelledby="scores-title">
        <h2 id="scores-title" className="modal-title">Top 10 Fastest</h2>
        <p className="modal-text">Your time: <strong>{yourTime}</strong></p>
        {scores.length === 0 ? (
          <p className="modal-text">No scores yet.</p>
        ) : (
          <table className="scores-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={s.id} className={s.id === myScoreId ? 'is-mine' : undefined}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{formatTime(s.timeMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button type="button" className="primary-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
