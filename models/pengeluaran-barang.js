const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pengeluaranbarangSchema = new Schema({
    nama: { type: String, require: true },
    jenis: { type: String },
    jumlah: { type: Number, require: true },
    harga: { type: Number, require: true },
    tanggal: { type: Date, required: true },
    tahun: { type: Number, require: true },
    bulan: { type: Number, require: true }
})

module.exports = mongoose.model('Pengeluaranbarang', pengeluaranbarangSchema)