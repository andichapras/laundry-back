const mongoose = require('mongoose')

const Schema = mongoose.Schema

const transaksiSchema = new Schema({
    nama: { type: String, required: true },
    email: { type: String, required: true },
    telepon: { type: String, require: true },
    laundry: [
        {
            id: { type: mongoose.Types.ObjectId, required: true, ref: 'Paket' },
            jumlah: { type: Number, required: true }
        }
    ],
    status: { type: Boolean, required: true },
    tanggal: { type: Date, required: true },
    uangMuka: { type: Number, required: true },
    totalBayar: { type: Number, required: true },
    modal: {type: Boolean, required: true},
    ambil: {type: Boolean, required: true}
})

module.exports = mongoose.model('Transaksi', transaksiSchema)