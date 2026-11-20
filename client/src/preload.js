// Downloads an image while reporting progress (0 to 1), then returns a
// local address the <img> tag can use. The browser then has it cached.
export async function preloadImage(url, onProgress) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch ${url}`);

  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) {
      onProgress(Math.min(1, received / total));
    } else {
      // No length to divide by (some servers stream without one), so ease
      // toward 1 as bytes arrive and never claim the whole download early.
      onProgress(Math.min(0.98, received / (received + 300 * 1024)));
    }
  }

  onProgress(1);
  const blob = new Blob(chunks, { type: res.headers.get('content-type') || 'image/jpeg' });
  return URL.createObjectURL(blob);
}

// Waits until the browser has decoded the picture, so it can be painted
// without a pause. Resolves even if the browser has no decode() support.
export function decodeImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    if (typeof img.decode === 'function') {
      img.decode().then(resolve, resolve);
      return;
    }
    img.onload = resolve;
    img.onerror = resolve;
  });
}
