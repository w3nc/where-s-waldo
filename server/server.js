// Starts the real server. The app itself lives in app.js.
require('./utils/loadEnv')();
const app = require('./app');

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`Where's Waldo server listening on http://localhost:${port}`);
});
