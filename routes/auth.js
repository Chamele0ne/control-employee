const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const router = Router()
const User = require('../models/User')

// /api/auth/register
router.post('/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
     
        try {
            const errors = validationResult(req)//валидация
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Неккоректные данные при регистрации'
                })
            }

            const { email, password } = req.body//данные с фронта

            const candidate = await User.findOne({ email })//поиск по базе
            if (candidate) {
               return  res.status(400).json({ message: 'Такой пользователь уже существует' })
            }
            const hashedPassword =await bcrypt.hash(password, 8)//хешируем пароль

            const user = new User({ email: email, password: hashedPassword })
    
            await user.save()
            return res.status(201).json({ message: 'Пользователь создан' })
        } catch (e) {
           return res.status(500).json({ message: 'Что-то пошло не так , попробуйте снова' , error: e.message})
        }
    })

// /api/auth/login
router.post('/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
   
        try {
         
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Неккоректные данные при входе в систему'
                })
            }
            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({message : 'Пользователь не найден'})
            }

            const isMatch = await (await bcrypt.compare(password, user.password))//сравнение паролей с базы и с формы
            if (!isMatch) {
                return res.status(400).json({message: 'Вы ввели неправильный пароль'})
            }

            const token = jwt.sign(//создание токена при логине 
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' } ,
            )
            res.json({ token, userId: user.id })//возвращаем токен
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так , попробуйте снова' })
        }
    })

module.exports = router
