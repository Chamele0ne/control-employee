const express = require('express')
const config = require('config')
const app = express()
const auth = require('./routes/auth')
const workers = require('./routes/worker')
const mongoose = require('mongoose')


const PORT = config.get('port') || 5000

app.use(express.json({extended : true}))

app.use('/api/auth',auth)
app.use('/api/workers',workers)

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl') , {
            useNewUrlParser : true , 
            useUnifiedTopology : true , 
            useCreateIndex : true 
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()
