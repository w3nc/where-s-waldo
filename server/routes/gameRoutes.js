const { Router } = require('express');
const { startGame, makeGuess, submitScore } = require('../controllers/gameController');

const router = Router();

router.post('/start', startGame);
router.post('/:id/guess', makeGuess);
router.post('/:id/score', submitScore);

module.exports = router;
