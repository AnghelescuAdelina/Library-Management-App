const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

//Middleware: Log all incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware: Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})