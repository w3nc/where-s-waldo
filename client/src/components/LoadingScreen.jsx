import { useEffect, useState } from 'react';

// The bar creeps toward the real percentage in small steps, so it always looks
// like it is moving instead of jumping in one jump when the download is quick.
export default function LoadingScreen({ src, progress }) {
  const target = Math.round(progress * 100);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setShown((prev) => {
        if (prev >= target) return target;
        const step = Math.max(1, Math.ceil((target - prev) * 0.25));
        return Math.min(target, prev + step);
      });
    }, 80);
    return () => clearInterval(id);
  }, [target]);

  // Never claim more than the page really has.
  const percent = Math.min(shown, target);

  return (
    <div className="loading-screen">
      <img className="loading-bg" src={src} alt="" />
      <div className="case-card" role="status" aria-live="polite">
        <p className="case-kicker">CASE FILE No. 1</p>
        <h1 className="case-title">WHERE&apos;S WALDO?</h1>
        <p className="case-note">Loading the scene&hellip;</p>
        <div
          className="stripe-bar"
          role="progressbar"
          aria-label="Loading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="stripe-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="case-percent">{percent}%</p>
      </div>
    </div>
  );
}
