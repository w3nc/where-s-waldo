const { Router } = require('express');
const { getScores } = require('../controllers/scoreController');

const router = Router();

router.get('/', getScores);

module.exports = router;
