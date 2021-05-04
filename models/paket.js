const mongoose = require('mongoose')

const Schema = mongoose.Schema

const paketSchema = new Schema({
    nama: { type: String, require: true },
    jenis: { type: String, require: true }, 
    harga: { type: Number, require: true },
    jumlah: { type: Number, require: true },
    modal: { type: Boolean, require: true }
})

module.exports = mongoose.model('Paket', paketSchema)