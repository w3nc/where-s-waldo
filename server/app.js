// Builds the Express app. It does NOT listen on a port, so tests can import it.
const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json({ limit: '1kb' }));

app.use('/game', gameRoutes);
app.use('/scores', scoreRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
