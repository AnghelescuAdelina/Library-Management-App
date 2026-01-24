const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');
const { validateToken } = require('../middleware/auth');


router.get('/', validateToken, getUserHistory);

module.exports = router;