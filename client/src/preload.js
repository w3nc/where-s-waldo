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
    if (total) onProgress(Math.min(1, received / total));
  }

  onProgress(1);
  const blob = new Blob(chunks, { type: res.headers.get('content-type') || 'image/jpeg' });
  return URL.createObjectURL(blob);
}
