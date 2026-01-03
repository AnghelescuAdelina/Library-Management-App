const express = require('express');
const router = express.Router();

// Rută de test pentru cărți
router.get('/', (req, res) => {
    res.json({ message: "Aici vor apărea toate cărțile din bibliotecă" });
});

module.exports = router;