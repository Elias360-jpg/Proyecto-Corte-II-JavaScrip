require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
};