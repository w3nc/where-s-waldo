import { useState } from 'react';

export default function NameModal({ timeText, onSubmit, error }) {
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError('Please type a name.');
      return;
    }
    if (trimmed.length > 20) {
      setLocalError('Name must be 20 characters or fewer.');
      return;
    }
    setLocalError('');
    onSubmit(trimmed);
  }

  return (
    <div className="modal-backdrop">
      <div className="paper modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title" className="modal-title">Case closed!</h2>
        <p className="modal-text">
          You found everyone in <strong>{timeText}</strong>. Sign your name to the score board.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="player-name" className="field-label">Your name</label>
          <input
            id="player-name"
            className="field"
            type="text"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {(localError || error) && (
            <p className="form-error" role="alert">
              {localError || error}
            </p>
          )}
          <button type="submit" className="primary-btn">Save score</button>
        </form>
      </div>
    </div>
  );
}
