const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pengeluaranSchema = new Schema({
    tanggal: { type: Date, require: true },
    bulan: { type: Number, require: true },
    tahun: { type: Number, require: true },
    pegawai: { type: Number, require: true },
    pengeluaran: { type: Number, require: true }
})

module.exports = mongoose.model('Pengeluaran', pengeluaranSchema)