const { Router } = require('express')
const config = require('config')
const { check, validationResult } = require('express-validator')
const Worker = require('../models/Worker')
const authMiddleware = require('../middleware/auth.middleware')
const router = Router()

router.post('/generate', [
    check('name', 'Некорректный name').isEmpty(),
    check('surename', 'Некорректный surename').isEmpty(),
    check('sale', 'Некорректный sale').isEmpty(),
    check('position', 'Некорректный position').isEmpty(),

], authMiddleware, async (req, res) => {//создание нового работника
    
    try {
        const errors = validationResult(req)//валидация
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: `Заполните обязательные поля ${JSON.stringify(errors)}`
            })
        }
        const { name, surename, male, phone,
            date, dateofbirth, sale, position } = req.body.character
        let currency = sale
        let timeFormat = Date.now()
        timeFormat = new Intl.DateTimeFormat('ru-RU').format(timeFormat)
        console.log(timeFormat)
        currency = new Intl.NumberFormat('ru-RU', {
            currency: 'uah',
            style: 'currency'
        }).format(currency)

        const newWorker = new Worker({
            name, surename, male, phone, date: timeFormat,
            sale: currency, position, dateofbirth, person: req.person.userId
        })

        await newWorker.save()
        res.status(201).json({ newWorker })

    } catch (e) {

        res.status(500).json({ message: 'Что-то пошло не так , попробуйте снова', error: e.message })
    }
}
)


router.get('/', authMiddleware, async (req, res) => {//все работники

    try {

        const workers = await Worker.find({ person: req.person.userId })//работники которые относятся к текущему пользователю
        res.json(workers)

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так , попробуйте снова', error: e.message })
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id)
        res.json(worker)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так , попробуйте снова', error: e.message })
    }
})

router.get('/edit', async (req, res) => {
    try {
        res.status(404).json({message : 'Что-то пошло не так , попробуйте снова'})
    } catch (e) {
console.log(e)
    }
})
router.post('/edit/:id', async (req, res) => {//редактировать 
    try {
        const worker = await Worker.findById(req.body._id)
        let currency = req.body.sale

        currency = new Intl.NumberFormat('ru-RU', {
            currency: 'uah',
            style: 'currency'
        }).format(currency)

        req.body.sale = currency

        Object.assign(worker, req.body)
        await worker.save()
        res.status(201).json({ message: "Изменения успешно применены" })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так , попробуйте снова', error: e.message })
    }
})

router.post('/remove/:id', async (req, res) => {//удаление
    try {
        const { id } = req.body
        const workers = await Worker.findById(id)
        await Worker.deleteOne({ _id: id })

        res.json({ message: "Eлемент удален" })
    } catch (e) {

        res.status(500).json({ message: 'Что-то пошло не так , попробуйте снова ', error: e.message })
    }
})
module.exports = router