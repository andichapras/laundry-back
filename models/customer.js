const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customerSchema = new Schema({
    nama: { type: String, require: true },
    email: { type: String, require: true },
    telepon: { type: String, require: true },
    jumlahTransaksi: { type: Number, require: true }
})

module.exports = mongoose.model('Customer', customerSchema)