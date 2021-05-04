const HttpError = require('../models/http-error')
const Paket = require('../models/paket')
const transaksi = require('../models/transaksi')

const CONTOH_PAKET = [
    {
        id: 'p1',
        nama: 'baju',
        jenis: 'luntur',
        harga: 4000
    },
    {
        id: 'p2',
        nama: 'baju',
        jenis: 'tidak luntur',
        harga: 3000
    },
    {
        id: 'p3',
        nama: 'Alat Tidur',
        jenis: 'Kecil',
        harga: 4000
    },
]

const getPaket = async (req, res, next) => {
    let paket
    try {
        paket = await Paket.find({})
    } catch(err) {
        const error = new HttpError('Tidak dapat mengambil Paket', 500)
        return next(error)
    }
    res.json({ paket: paket.map(p => p.toObject({ getters: true })) })
}

const getPaketById = async (req, res, next) => {
    const paketId = req.params.pid
    
    let paket
    try {
        paket = await Paket.findById(paketId)
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari paket',
            500
        )
        return next(error)
    }

    res.json({ paket: paket.toObject({ getters: true }) })
}

const updatePaketById = async (req, res, next) => {
    const { harga } = req.body
    const paketId = req.params.pid

    // const updatePaket = {...CONTOH_PAKET.find(p => p.id === paketId)}
    // const paketIndex = CONTOH_PAKET.findIndex(p => p.id === paketId)

    let paket
    try {
        paket = await Paket.findById(paketId)
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat edit harga paket',
            500
        )
        return next(error)
    }
    console.log(paket)
    paket.harga = harga

    try {
        await paket.save()
    } catch (err) {
        const error = new HttpError(
            'Error, tidak dapat edot harga paket',
            500
        )
        return next(error)
    }

    res.status(200).json({ paket: paket.toObject({ getters: true }) })
}

exports.getPaketById = getPaketById
exports.updatePaketById = updatePaketById
exports.getPaket = getPaket