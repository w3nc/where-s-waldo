// Loads server/.env into process.env. Uses Node's built-in loader when this
// Node version has it (Node 20.12+), otherwise reads the file by hand.
const fs = require('fs');
const path = require('path');

module.exports = function loadEnv(file = path.join(__dirname, '..', '.env')) {
  if (!fs.existsSync(file)) return;

  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(file);
    return;
  }

  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
};
