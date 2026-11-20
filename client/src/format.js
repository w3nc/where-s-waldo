// Turns milliseconds into a readable time, e.g. 75430 -> "01:15.43".
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const hundredths = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${String(minutes).padStart(2, '0')}:${seconds}.${hundredths}`;
}
