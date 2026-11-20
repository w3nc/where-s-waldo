import { useEffect, useRef, useState } from 'react';
import { CHARACTERS, ILLUSTRATION_URL, LOADING_URL } from './characters.js';
import { preloadImage, decodeImage } from './preload.js';
import { startGame, guessCharacter, saveScore, fetchScores } from './api.js';
import LoadingScreen from './components/LoadingScreen.jsx';
import Board from './components/Board.jsx';
import WantedCard from './components/WantedCard.jsx';
import NameModal from './components/NameModal.jsx';
import ScoresTable from './components/ScoresTable.jsx';
import TopScores from './components/TopScores.jsx';
import { formatTime } from './format.js';

const TOTAL = CHARACTERS.length;
// The download is only part of the wait, so it fills the bar up to here.
// The last stretch is for decoding the picture and starting the game.
const DOWNLOAD_SHARE = 0.9;

export default function App() {
  const [phase, setPhase] = useState('loading'); // loading | playing | saving | scores
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [found, setFound] = useState([]);
  const [markers, setMarkers] = useState([]); // {name, x, y} for red rings
  const [target, setTarget] = useState(null); // {x, y} fractions of the image
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [startedAt, setStartedAt] = useState(null);
  const [finalMs, setFinalMs] = useState(null);
  const [scores, setScores] = useState([]);
  const [myScore, setMyScore] = useState(null);
  const [saveError, setSaveError] = useState('');
  const toastTimer = useRef(null);

  // 1. Preload the illustration, then start a game on the server.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = await preloadImage(ILLUSTRATION_URL, (p) => {
          if (!cancelled) setProgress(p * DOWNLOAD_SHARE);
        });
        // Wait for the browser to decode it, so the picture shows at once.
        await decodeImage(url);
        if (cancelled) return;
        const { gameId: id } = await startGame();
        if (cancelled) return;
        setProgress(1);
        sessionStorage.setItem('gameId', id);
        setGameId(id);
        setImageUrl(url);
        setStartedAt(Date.now());
        // A short beat so the full bar is seen instead of a flicker.
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (cancelled) return;
        setPhase('playing');
        fetchScores().then(setScores).catch(() => {});
      } catch {
        if (!cancelled) showToast('Could not load the game. Refresh the page to try again.');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer shown on screen. The real time is measured by the server.
  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function handleImageClick(point) {
    if (phase !== 'playing') return;
    setTarget(point);
  }

  async function handlePick(name) {
    const point = target;
    setTarget(null);
    if (!point) return;
    try {
      const result = await guessCharacter(gameId, { character: name, x: point.x, y: point.y });
      if (result.correct) {
        setFound(result.found);
        setMarkers((m) => [...m, { name, x: point.x, y: point.y }]);
        if (result.found.length === TOTAL) {
          setFinalMs(Date.now() - startedAt);
          setPhase('saving');
        }
      } else {
        showToast(`Not ${name} there. Keep looking!`);
      }
    } catch (err) {
      showToast(err.message || 'Something went wrong. Try again.');
    }
  }

  async function handleSaveName(name) {
    setSaveError('');
    try {
      const score = await saveScore(gameId, name);
      setMyScore(score);
      setScores(await fetchScores());
      setPhase('scores');
    } catch (err) {
      setSaveError(err.message || 'Could not save your score.');
    }
  }

  const unfound = CHARACTERS.filter((c) => !found.includes(c.name)).map((c) => c.name);
  const elapsed = phase === 'playing' ? now - startedAt : finalMs ?? 0;

  if (phase === 'loading') {
    return <LoadingScreen src={LOADING_URL} progress={progress} />;
  }

  return (
    <div className="app">
      <header className="top-bar">
        <h1 className="title">WHERE&apos;S WALDO?</h1>
        <div className="top-right">
          <span className="found-count">FOUND {found.length} / {TOTAL}</span>
          <div className="timer-plate" aria-label="Elapsed time">
            <span className="timer-label">TIME</span>
            <span className="timer-value">{formatTime(elapsed)}</span>
          </div>
        </div>
      </header>

      <main className="layout">
        <Board
          src={imageUrl}
          markers={markers}
          target={target}
          unfound={unfound}
          onImageClick={handleImageClick}
          onPick={handlePick}
          onCancel={() => setTarget(null)}
          disabled={phase !== 'playing'}
        />
        <div className="sidebar">
          <WantedCard found={found} />
          <TopScores scores={scores} myScoreId={myScore?.id} />
        </div>
      </main>

      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}

      {phase === 'saving' && (
        <NameModal
          timeText={formatTime(finalMs)}
          onSubmit={handleSaveName}
          error={saveError}
        />
      )}

      {phase === 'scores' && (
        <ScoresTable
          scores={scores}
          myScoreId={myScore?.id}
          yourTime={formatTime(myScore?.timeMs ?? 0)}
          onClose={() => setPhase('finished')}
        />
      )}
    </div>
  );
}
