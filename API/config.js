require('dotenv').config(); 

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_doar_pentru_local',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    PORT: process.env.PORT || 5000
};