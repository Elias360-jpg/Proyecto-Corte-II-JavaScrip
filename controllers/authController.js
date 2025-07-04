const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { jwtSecret, refreshTokenSecret, accessTokenExpiration, refreshTokenExpiration } = require('../config/jwt');

function generateTokens(user) {
    const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtSecret, { expiresIn: accessTokenExpiration });
    const refreshToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, refreshTokenSecret, { expiresIn: refreshTokenExpiration });
    return { accessToken, refreshToken };
}

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
        }
        const newUser = await User.create({ username, password, role });
        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: { id: newUser.id, username: newUser.username, role: newUser.role } });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        await User.updateRefreshToken(user.id, refreshToken); // Guarda el refresh token en la DB

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};

exports.refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'Se requiere Refresh Token.' });
    }

    try {
        const user = await User.findByRefreshToken(token);
        if (!user) {
            return res.status(403).json({ message: 'Refresh Token inválido o no encontrado.' });
        }

        jwt.verify(token, refreshTokenSecret, async (err, decoded) => {
            if (err || decoded.id !== user.id) { // Verificar que el token pertenezca al usuario
                return res.status(403).json({ message: 'Refresh Token inválido.' });
            }

            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
            await User.updateRefreshToken(user.id, newRefreshToken);

            res.json({ accessToken, refreshToken: newRefreshToken });
        });
    } catch (error) {
        console.error('Error al refrescar token:', error);
        res.status(500).json({ message: 'Error interno del servidor al refrescar token.' });
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.user.id; // Asumimos que el userId está en req.user por el authenticateToken
        await User.updateRefreshToken(userId, null); // Elimina el refresh token de la DB
        res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al cerrar sesión.' });
    }
};