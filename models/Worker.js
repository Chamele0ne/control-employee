const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    name: { type: String,  required: true  },
    surename: { type: String, required: true },
    male: { type: String },
    phone: { type: String },
    date: { type: String },
    dateofbirth: { type: String, required: true },
    sale: { type: String, required: true },
    position: { type: String, required: true },
    person: { type: Types.ObjectId, ref: 'User' }

})

module.exports = model('Worker', schema)