const {v4: uuid}  = require('uuid')
const mongoose = require('mongoose')
var moment = require('moment')

const HttpError = require('../models/http-error')
const Transaksi = require('../models/transaksi')
const Paket = require('../models/paket')
const Pemasukan = require('../models/laporan-pemasukan')
const Laporan = require('../models/laporan-utama')
const Customer = require('../models/customer')

// const mailgun = require('mailgun-js')

const getTransaksi = async (req, res, next) => {
    let transaksi
    try {
        transaksi = await Transaksi.find({})
    } catch (err) {
        const error = new HttpError('Tidak dapat mengambil Transaksi', 500)
        return next(error)
    }
    res.json({ transaksi: transaksi.map(p => p.toObject({ getters: true })) })
}

const getTransaksiById = async (req, res, next) => {
    const transaksiId = req.params.transid

    let transaksi
    try {
        transaksi = await Transaksi.find({_id : transaksiId})
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari transaksi',
            500
        )
        return next(error)
    }

    // if(!transaksi) {
    //     throw new HttpError('Tidak dapat menemukan transaksi', 404)
    // }

    res.json({ transaksi: transaksi.map(t => t.toObject({ getters: true })) })
}

const getTransaksiByCustomer = async (req, res, next) => {
    const customer = req.params.cusnama

    let transaksiByCustomer
    try {
        transaksiByCustomer = await Transaksi.find({ nama: customer })
    } catch(err) {
        const error = new HttpError(
            'Tidak dapat mencari transaksi berdasarkan nama customer',
            500
        )
        return next(error)
    }

    res.json({ transaksiByCustomer: transaksiByCustomer.map(t => t.toObject({ getters: true })) })
}

const getTransaksiByTelepon = async (req, res, next) => {
    const notelp = req.params.custelp

    let transaksiByTelepon
    try {
        transaksiByTelepon = await Transaksi.find({ telepon: notelp })
    } catch(err) {
        const error = new HttpError(
            'Tidak dapat mencari transaksi berdasarkan notelp customer',
            500
        )
        return next(error)
    }

    res.json({ transaksiByTelepon: transaksiByTelepon.map(t => t.toObject({ getters: true })) })
}

const getTransaksiByEmail = async (req, res, next) => {
    const email = req.params.cusmail

    let transaksiByEmail
    try {
        transaksiByEmail = await Transaksi.find({ email: email })
    } catch(err) {
        const error = new HttpError(
            'Tidak dapat mencari transaksi berdasarkan email customer',
            500
        )
        return next(error)
    }

    res.json({ transaksiByEmail: transaksiByEmail.map(t => t.toObject({ getters: true })) })
}

const getTransaksiByStatus = async (req, res, next) => {
    let transaksiByStatus
    try {
        transaksiByStatus = await Transaksi.find({ status: false })
    } catch(err) {
        const error = new HttpError(
            'Tidak dapat mencari transaksi yang belum selesai',
            500
        )
        return next(error)
    }

    res.json({ transaksiByStatus: transaksiByStatus.map(t => t.toObject({ getters: true })) })
}

const getTransaksiForAmbil = async (req, res, next) => {
    let transaksiForAmbil
    try {
        transaksiForAmbil = await Transaksi.find({ status: true, ambil: false })
    } catch(err) {
        const error = new HttpError(
            'Tidak dapat mencari transaksi yang belum diambil',
            500
        )
        return next(error)
    }

    res.json({ transaksiForAmbil: transaksiForAmbil.map(t => t.toObject({ getters: true })) })
}

const getTransaksiByMonth = (req, res, next) => {

}

const createCustomer = async (req, res, next) => {
    const { nama, email } = req.body
    const createdCustomer = new Customer ({
        nama,
        email,
        jumlahTransaksi: 0
    })

    try {
        await createdCustomer.save()
    } catch(err) {
        const error = new HttpError(
            'Tidak dapat membuat Customer',
            500
        )
        return next(error)
    }
}

const createTransaksi = async (req, res, next) => {
    const { nama, email, telepon, laundry, uangMuka } = req.body
    
    const tglTransaksi = moment().format('L')

    let uang = 0
    if(uangMuka == null) {
        uang
    } else {
        uang = uangMuka
    }

    // console.log(nama + " " + email + " " + uangMuka + " " + laundry)

    let cuciArr = laundry.map( c => c.id)
    let a = []
    let i, total = 0

    try {
        for(i = 0; i < cuciArr.length; i++) {
            a.push(await Paket.findById(cuciArr[i]))
        }
    } catch (err) {
        const error = new HttpError(
            'Pembuatan transaksi gagal',
            500
        )
        return next(error)
    }

    for(i = 0; i < a.length; i++) {
        total+= a[i].harga * laundry[i].jumlah
    }

    const createdTransaksi = new Transaksi({
        nama,
        email,
        telepon,
        laundry,
        status: false,
        tanggal: tglTransaksi,
        uangMuka: uang,
        totalBayar: total,
        modal: false,
        ambil: false
    })

    try {
        await createdTransaksi.save()
    } catch (err) {
        const error = new HttpError(
            'Error, Pembuatan transaksi gagal',
            500
        )
        return next(error)
    }
    
    res.status(201).json({ transaksi: createdTransaksi })
}

const finishTransaksi = async (req, res, next) => {
    const transaksiId = req.params.transid
    
    let transaksi
    try {
        transaksi = await Transaksi.findById(transaksiId)
    } catch (err) {
        const error = new HttpError(
            'tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    transaksi.status = true

    try {
        await transaksi.save()
    } catch (err) {
        const error = new HttpError(
            'Error, tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    res.status(200).json({ transaksi: transaksi.toObject({ getters: true }) })
}

const ambilTransaksiByNota = async (req, res, next) => {
    // const { uangMuka } = req.body
    const transNota = req.params.transnota

    // const finishTransaksi = { ...CONTOH_INVOICE.find(t => t.id === transNota) }
    // const indexTransaksi = CONTOH_INVOICE.find(t => t.id === transNota)

    let transaksi
    try {
        transaksi = await Transaksi.findById(transNota)
    } catch (err) {
        const error = new HttpError(
            'tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    let findCustomer
    let customer

    try {
        findCustomer = await Customer.exists({ nama: transaksi.nama, email: transaksi.email })
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari Customer',
            500
        )
        return next (error)
    }

    if(findCustomer === false) {
        const createdCustomer = new Customer({
            nama: transaksi.nama,
            email: transaksi.email,
            telepon: transaksi.telepon,
            jumlahTransaksi: 1
        })

        try {
            await createdCustomer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat membuat Customer',
                500
            )
            return next (error)
        }
    } else {
        try {
            customer = await Customer.findOne({ nama: transaksi.nama, email: transaksi.email })
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat mencari Customer',
                500
            )
            return next (error)
        }
        customer.jumlahTransaksi+= 1
        try {
            customer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat menambah jumlah transaksi Custoemr',
                500
            )
            return next (error)
        }
    }

    let laporanUtama
    try {
        laporanUtama = await Laporan.findOne({ bulan: moment(transaksi.tanggal).month(), tahun: moment(transaksi.tanggal).year() })
    } catch (err) {
        const error = new HttpError(
            'Penambahan pemasukan gagal karena laporan Utama',
            500
        )
        return next(error)
    }

    if(!laporanUtama) {
        const error = new HttpError('Could not find laporan Utama', 404)
        return next(error)
    }

    transaksi.ambil = true
    // transaksi.uangMuka = uangMuka

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        console.log(transaksi)
        console.log(laporanUtama)
        await transaksi.save({ session: sess })
        laporanUtama.transaksi+= 1
        laporanUtama.pelanggan+= 1
        laporanUtama.pemasukan+= transaksi.totalBayar
        laporanUtama.keuntungan+= transaksi.totalBayar
        await laporanUtama.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        const error = new HttpError(
            'Error, tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    res.status(200).json({ transaksi: transaksi.toObject({ getters: true }) })
}

const ambilTransaksiByEmail = async (req, res, next) => {
    // const { uangMuka } = req.body
    const cusEmail = req.params.cusmail

    let transaksi
    try {
        transaksi = await Transaksi.find({ email: cusEmail })
    } catch(err) {
        const error = new HttpError(
            'tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    let findCustomer
    let customer

    try {
        findCustomer = await Customer.exists({ nama: transaksi.nama, email: transaksi.email })
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari Customer',
            500
        )
        return next (error)
    }

    if(findCustomer === false) {
        const createdCustomer = new Customer({
            nama: transaksi.nama,
            email: transaksi.email,
            telepon: transaksi.telepon,
            jumlahTransaksi: 1
        })

        try {
            await createdCustomer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat membuat Customer',
                500
            )
            return next (error)
        }
    } else {
        try {
            customer = await Customer.findOne({ nama: transaksi.nama, email: transaksi.email })
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat mencari Customer',
                500
            )
            return next (error)
        }
        customer.jumlahTransaksi+= 1
        try {
            customer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat menambah jumlah transaksi Custoemr',
                500
            )
            return next (error)
        }
    }

    let laporanUtama
    try {
        laporanUtama = await Laporan.findOne({ bulan: moment(transaksi.tanggal).month(), tahun: moment(transaksi.tanggal).year() })
    } catch (err) {
        const error = new HttpError(
            'Penambahan pemasukan gagal karena laporan Utama',
            500
        )
        return next(error)
    }

    if(!laporanUtama) {
        const error = new HttpError('Could not find laporan Utama', 404)
        return next(error)
    }

    transaksi.ambil = true
    // transaksi.uangMuka = uangMuka

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await transaksi.save({ session: sess })
        laporanUtama.transaksi+= 1
        laporanUtama.pelanggan+= 1
        laporanUtama.pemasukan+= transaksi.totalBayar
        laporanUtama.keuntungan+= transaksi.totalBayar
        await laporanUtama.save({ session: sess })
        await sess.commitTransaction()
    } catch(err) {
        const error = new HttpError(
            'Error, tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    res.status(200).json({ transaksi: transaksi.toObject({ getters: true }) })
}

const ambilTransaksiByNama = async (req, res, next) => {
    const cusNama = req.params.ambilnama

    let transaksi
    try {
        transaksi = await Transaksi.find({ nama: cusNama })
    } catch(err) {
        const error = new HttpError(
            'tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    let findCustomer
    let customer

    try {
        findCustomer = await Customer.exists({ nama: transaksi.nama, email: transaksi.email })
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari Customer',
            500
        )
        return next (error)
    }

    if(findCustomer === false) {
        const createdCustomer = new Customer({
            nama: transaksi.nama,
            email: transaksi.email,
            telepon: transaksi.telepon,
            jumlahTransaksi: 1
        })

        try {
            await createdCustomer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat membuat Customer',
                500
            )
            return next (error)
        }
    } else {
        try {
            customer = await Customer.findOne({ nama: transaksi.nama, email: transaksi.email })
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat mencari Customer',
                500
            )
            return next (error)
        }
        customer.jumlahTransaksi+= 1
        try {
            customer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat menambah jumlah transaksi Custoemr',
                500
            )
            return next (error)
        }
    }

    let laporanUtama
    try {
        laporanUtama = await Laporan.findOne({ bulan: moment(transaksi.tanggal).month(), tahun: moment(transaksi.tanggal).year() })
    } catch (err) {
        const error = new HttpError(
            'Penambahan pemasukan gagal karena laporan Utama',
            500
        )
        return next(error)
    }

    if(!laporanUtama) {
        const error = new HttpError('Could not find laporan Utama', 404)
        return next(error)
    }

    transaksi.ambil = true
    // transaksi.uangMuka = uangMuka

    try {
        const nama = await mongoose.startSession()
        nama.startTransaction()
        console.log(transaksi)
        console.log(laporanUtama)
        await transaksi.save({ session: nama })
        laporanUtama.transaksi+= 1
        laporanUtama.pelanggan+= 1
        laporanUtama.pemasukan+= transaksi.totalBayar
        laporanUtama.keuntungan+= transaksi.totalBayar
        await laporanUtama.save({ session: nama })
        await nama.commitTransaction()
    } catch(err) {
        const error = new HttpError(
            'Error, tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    res.status(200).json({ transaksi: transaksi.toObject({ getters: true }) })
}

const ambilTransaksiByTelepon = async (req, res, next) => {
    const cusTelp = req.params.custelp

    let transaksi
    try {
        transaksi = await Transaksi.find({ telepon: cusTelp })
    } catch(err) {
        const error = new HttpError(
            'tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    let findCustomer
    let customer

    try {
        findCustomer = await Customer.exists({ nama: transaksi.nama, email: transaksi.email })
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari Customer',
            500
        )
        return next (error)
    }

    if(findCustomer === false) {
        const createdCustomer = new Customer({
            nama: transaksi.nama,
            email: transaksi.email,
            telepon: transaksi.telepon,
            jumlahTransaksi: 1
        })

        try {
            await createdCustomer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat membuat Customer',
                500
            )
            return next (error)
        }
    } else {
        try {
            customer = await Customer.findOne({ nama: transaksi.nama, email: transaksi.email })
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat mencari Customer',
                500
            )
            return next (error)
        }
        customer.jumlahTransaksi+= 1
        try {
            customer.save()
        } catch (err) {
            const error = new HttpError(
                'Tidak dapat menambah jumlah transaksi Custoemr',
                500
            )
            return next (error)
        }
    }

    let laporanUtama
    try {
        laporanUtama = await Laporan.findOne({ bulan: moment(transaksi.tanggal).month(), tahun: moment(transaksi.tanggal).year() })
    } catch (err) {
        const error = new HttpError(
            'Penambahan pemasukan gagal karena laporan Utama',
            500
        )
        return next(error)
    }

    if(!laporanUtama) {
        const error = new HttpError('Could not find laporan Utama', 404)
        return next(error)
    }

    transaksi.ambil = true
    // transaksi.uangMuka = uangMuka

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await transaksi.save({ session: sess })
        laporanUtama.transaksi+= 1
        laporanUtama.pelanggan+= 1
        laporanUtama.keuntungan+= transaksi.totalBayar
        await laporanUtama.save({ session: sess })
        await sess.commitTransaction()
    } catch(err) {
        const error = new HttpError(
            'Error, tidak dapat menyelesaikan transaksi',
            500
        )
        return next(error)
    }

    res.status(200).json({ transaksi: transaksi.toObject({ getters: true }) })
}

exports.getTransaksi = getTransaksi
exports.getTransaksiById = getTransaksiById
exports.getTransaksiByCustomer = getTransaksiByCustomer
exports.getTransaksiByTelepon = getTransaksiByTelepon
exports.getTransaksiByEmail = getTransaksiByEmail
exports.getTransaksiByStatus = getTransaksiByStatus
exports.getTransaksiForAmbil = getTransaksiForAmbil
exports.getTransaksiByMonth = getTransaksiByMonth
exports.createTransaksi = createTransaksi
exports.finishTransaksi = finishTransaksi
exports.ambilTransaksiByNota = ambilTransaksiByNota
exports.ambilTransaksiByEmail = ambilTransaksiByEmail
exports.ambilTransaksiByNama = ambilTransaksiByNama
exports.ambilTransaksiByTelepon = ambilTransaksiByTelepon