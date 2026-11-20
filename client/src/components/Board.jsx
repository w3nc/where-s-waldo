import { useState } from 'react';
import { CHARACTERS } from '../characters.js';

// Square size of the targeting box, in pixels.
const BOX = 64;

export default function Board({
  src,
  markers,
  target,
  unfound,
  onImageClick,
  onPick,
  onCancel,
  disabled,
}) {
  const [imgReady, setImgReady] = useState(false);

  function handleClick(event) {
    if (disabled || unfound.length === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onImageClick({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  }

  return (
    <section className="board-wrap" aria-label="Illustration to search">
      <div className="paper board-paper">
        <div className="pin" aria-hidden="true" />
        <div className="board">
          {src ? (
            <img
              src={src}
              alt="A busy scene with many tiny people. Click to target a character."
              className="scene"
              onClick={handleClick}
              onLoad={() => setImgReady(true)}
              draggable={false}
            />
          ) : (
            <div className="scene-placeholder" />
          )}

          {imgReady &&
            markers.map((m) => (
              <div
                key={`${m.name}-${m.x}-${m.y}`}
                className="ring"
                style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
                aria-label={`${m.name} found`}
              />
            ))}

          {imgReady && target && (
            <div
              className="target-box"
              style={{
                left: `${target.x * 100}%`,
                top: `${target.y * 100}%`,
                width: BOX,
                height: BOX,
              }}
            >
              <div className="target-dropdown" role="group" aria-label="Choose a character">
                <p className="target-heading">Who is it?</p>
                {CHARACTERS.filter((c) => unfound.includes(c.name)).map((c) => (
                  <button key={c.name} type="button" className="pick-btn" onClick={() => onPick(c.name)}>
                    {c.name}
                  </button>
                ))}
                <button type="button" className="cancel-btn" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
