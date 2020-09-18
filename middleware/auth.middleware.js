const jwt = require('jsonwebtoken')
const config = require ('config')
const authMiddleware = (req, res, next) => {


    try {
        const token = req.headers.authorization.split(' ')[1]//передаем c фронта проверку авторизации

        if (!token) {
           return res.status(401).json({ message: ' Нет авторизации' })
        }

        const decoded = jwt.verify (token , 
            config.get('jwtSecret'))//разкодировка токена
            req.person = decoded//кладем в обьект запроса
            next()
    } catch (e) {
        res.status(401).json({message : "Нет авторизации"})
    }
}

module.exports = authMiddleware