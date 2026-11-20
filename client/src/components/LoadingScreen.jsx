export default function LoadingScreen({ src, progress }) {
  const percent = Math.round(progress * 100);
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
