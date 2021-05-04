const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pemasukanSchema = new Schema({
    tanggal: { type: Date, require: true },
    tahun: { type: Number, require: true },
    bulan: { type: Number, require: true },
    transaksi: { type: Number, require: true },
    pelanggan: { type: Number, require: true },
    pemasukan: { type: Number, require: true }
})

module.exports = mongoose.model('Pemasukan', pemasukanSchema)