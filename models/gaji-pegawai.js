const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gajiSchema = new Schema({
    nama: { type: String, require: true },
    tugas: { type: String, require: true },
    gaji: { type: Number, require: true },
    tanggal: { type: Date, required: true },
    tahun: { type: Number, require: true },
    bulan: { type: Number, require: true }
})

module.exports = mongoose.model('Gaji', gajiSchema)