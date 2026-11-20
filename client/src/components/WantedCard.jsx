import { CHARACTERS } from '../characters.js';

export default function WantedCard({ found }) {
  return (
    <aside className="paper wanted-card" aria-label="Characters to find">
      <h2 className="wanted-title">WANTED</h2>
      <ul className="wanted-list">
        {CHARACTERS.map((c) => {
          const isFound = found.includes(c.name);
          return (
            <li key={c.name} className={`wanted-item${isFound ? ' is-found' : ''}`}>
              <img className="avatar" src={c.avatar} alt={`${c.name} avatar`} />
              <span className="wanted-name">{c.name}</span>
              {isFound && <span className="found-stamp">FOUND</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
