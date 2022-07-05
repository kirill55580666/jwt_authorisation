const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'})
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            console.log('Перезаписываем рефреш токен')
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        console.log('Записываем новый рефреш токен')
        return token;
    }
    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        console.log('Удаляем рефреш токен')
        return tokenData;
    }
    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
}

module.exports = new TokenService()