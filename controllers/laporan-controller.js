const HttpError = require('../models/http-error')
const {v4: uuid}  = require('uuid')
const mongoose = require('mongoose')
var moment = require('moment')

const PengeluaranBarang = require('../models/pengeluaran-barang')
const Gaji = require('../models/gaji-pegawai')
const Pengeluaran = require('../models/laporan-pengeluaran')
const Pemasukan = require('../models/laporan-pemasukan')
const Laporan = require('../models/laporan-utama')

const createPengeluaranBarang = async (req, res, next) => {
    createLaporanUtamaByMonth()

    const { nama, jenis, jumlah, harga } = req.body

    const tglInput = moment().format('L')
    const bulanNow = moment(tglInput).month()
    const tahunNow = moment(tglInput).year()

    let jenisBarang = "-"
    if(jenis == null) {
        jenisBarang
    } else {
        jenisBarang = jenis
    }

    const createdPengeluaranBarang = new PengeluaranBarang({
        nama,
        jenis: jenisBarang,
        jumlah,
        harga,
        tanggal: tglInput,
        bulan: bulanNow,
        tahun: tahunNow
    })
    
    let laporanUtama
    try {
        laporanUtama = await Laporan.findOne({ bulan: moment(tglInput).month(), tahun: moment(tglInput).year() })
    } catch (err) {
        const error = new HttpError(
            'Penambahan pengeluaran pegawai gagal karena laporan Utama',
            500
        )
        return next(error)
    }

    if(!laporanUtama) {
        const error = new HttpError('Could not find laporan Utama', 404)
        return next(error)
    }

    try {
        // await createdPengeluaranBarang.save()
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPengeluaranBarang.save({ session: sess })
        laporanUtama.pengeluaran+= harga
        laporanUtama.keuntungan-= harga
        await laporanUtama.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        const error = new HttpError(
            'Penambahan pengeluaran gagal',
            500
        )
        return next(error)
    }

    res.status(201).json({ pengeluaranBarang: createdPengeluaranBarang })
}

const createGajiPegawai = async (req, res, next) => {
    createLaporanUtamaByMonth()

    const { nama, tugas, gaji } = req.body

    const tglInput = moment().format('L')
    const bulanNow = moment(tglInput).month()
    const tahunNow = moment(tglInput).year()

    const createdGajiPegawai = new Gaji({
        nama,
        tugas,
        gaji,
        tanggal: tglInput,
        bulan: bulanNow,
        tahun: tahunNow
    })
    
    let laporanUtama
    try {
        laporanUtama = await Laporan.findOne({ bulan: moment(tglInput).month(), tahun: moment(tglInput).year() })
    } catch (err) {
        const error = new HttpError(
            'Penambahan pengeluaran pegawai gagal karena laporan Utama',
            500
        )
        return next(error)
    }

    if(!laporanUtama) {
        const error = new HttpError('Could not find laporan Utama', 404)
        return next(error)
    }

    try {
        // await createdGajiPegawai.save()
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdGajiPegawai.save({ session: sess })
        laporanUtama.pegawai+= 1
        laporanUtama.pengeluaran+= gaji
        laporanUtama.pegawai+= 1
        laporanUtama.keuntungan-= gaji
        await laporanUtama.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        const error = new HttpError(
            'Error, Penambahan pengeluaran pegawai gagal',
            500
        )
        return next(error)
    }

    res.status(201).json({ gajiPegawai: createdGajiPegawai })
}

const getPengeluaranBarang = async (req, res, next) => {
    let pengeluaranBarang
    try {
        pengeluaranBarang = await PengeluaranBarang.find({})
    } catch(err) {
        const error = new HttpError('Tidak dapat mengambil Paket', 500)
        return next(error)
    }

    res.json({ pengeluaranBarang: pengeluaranBarang.map(p => p.toObject({ getters: true })) })
}

const getPengeluaranBarangNow = async (req, res, next) => {
    const now = moment().format('L')

    let pengeluaranBarangNow
    try {
        pengeluaranBarangNow = await PengeluaranBarang.find({ bulan: moment(now).month(), tahun: moment(now).year() })
    } catch(err) {
        const error = new HttpError('Tidak dapat mengambil Paket', 500)
        return next(error)
    }

    res.json({ pengeluaranBarangNow: pengeluaranBarangNow.map(p => p.toObject({ getters: true })) })
}

const getGajiPegawai = async (req, res, next) => {
    let gajiPegawai
    try {
        gajiPegawai = await Gaji.find({})
    } catch(err) {
        const error = new HttpError('Tidak dapat mengambil Paket', 500)
        return next(error)
    }

    res.json({ gajiPegawai: gajiPegawai.map(p => p.toObject({ getters: true })) })
}

const getGajiPegawaiNow = async (req, res, next) => {
    const now = moment().format('L')

    let gajiPegawaiNow
    try {
        gajiPegawaiNow = await Gaji.find({ bulan: moment(now).month(), tahun: moment(now).year() })
    } catch(err) {
        const error = new HttpError('Tidak dapat mengambil Paket', 500)
        return next(error)
    }

    res.json({ gajiPegawaiNow: gajiPegawaiNow.map(p => p.toObject({ getters: true })) })
}

const getPengeluaranBarangById = async (req, res, next) => {
    const pengeluaranBarangId = req.params.barangid

    let pengeluaranBarang
    try {
        pengeluaranBarang = await PengeluaranBarang.findById(pengeluaranBarangId)
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari pengeluaran',
            500
        )
        return next(error)
    }

    res.json({ pengeluaranBarang: pengeluaranBarang.toObject({ getters: true }) })
}

const deletePengeluaranBarangById = async (req, res, next) => {
    let barangId = req.params.barangid

    let pengeluaranBarang
    try {
        pengeluaranBarang = await PengeluaranBarang.findById(barangId)
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat menghapus pengeluaran',
            500
        )
        return next(error)
    }

    try {
        await pengeluaranBarang.remove()
    } catch (err) {
        const error = new HttpError(
            'Error, tidak dapat menghapus pengeluaran',
            500
        )
        return next (error)
    }

    res.status(200).json({ pesan: 'barang telah terhapus' })
}

const deletePemasukanById = (req, res, next) => {
    const pemasukanId = req.params.masukid
    if(!CONTOH_INVOICE.find(t => t.id === pemasukanId)) {
        throw new HttpError('Tidak dapat menemukan id', 404)
    }
    CONTOH_INVOICE = CONTOH_INVOICE.filter(t => t.id !== pemasukanId)
    res.status(200).json({ pesan: 'Transaksi telah dihapus' })
}

const createLaporanUtamaByMonth = async (req, res, next) => {
    const now = moment()
    const bulanNow = moment(now).month()
    const tahunNow = moment(now).year()

    let finded
    try {
        finded = await Laporan.exists({ bulan: bulanNow, tahun: tahunNow })
    } catch (err) {
        const error = new HttpError(
            'Tidak dapat mencari tanggal Laporan',
            500
        )
        return next (error)
    }

    const createdLaporan = new Laporan({
        tanggal: now,
        bulan: bulanNow,
        tahun: tahunNow,
        transaksi: 0,
        pelanggan: 0,
        pegawai: 0,
        pemasukan: 0,
        pengeluaran: 0,
        keuntungan: 0
    })

    if(finded === false) {
        try {
            await createdLaporan.save()
        } catch (err) {
            const error = new HttpError(
                'Error, tidak dapat membuat laporan Utama',
                500
            )
            return next (error)
        }
    }
}

const getLaporanUtama = async (req, res, next) => {
    createLaporanUtamaByMonth()

    let laporanUtama
    try {
        laporanUtama = await Laporan.find({})
    } catch (err) {
        const error = new HttpError(
            'Error, tidak dapat menampilkan laporan Utama',
            500
        )
        return next (error)
    }

    res.json({ laporanUtama: laporanUtama.map(p => p.toObject({ getters: true })) })
}

const getLaporanUtamaNow = async (req, res, next) => {
    createLaporanUtamaByMonth()
    const now = moment().format('L')
    const bulanNow = moment(now).month()
    const tahunNow = moment(now).year()

    let laporanUtamaNow
    try {
        laporanUtamaNow = await Laporan.findOne({ bulan: bulanNow, tahun: tahunNow })
    } catch (err) {
        const error = new HttpError(
            'Error, tidak dapat menampilkan laporan Utama',
            500
        )
        return next (error)
    }

    res.json({ laporanUtamaNow: laporanUtamaNow.toObject({ getters: true }) })
}

exports.createPengeluaranBarang = createPengeluaranBarang
exports.createGajiPegawai = createGajiPegawai
exports.getPengeluaranBarang = getPengeluaranBarang
exports.getPengeluaranBarangNow = getPengeluaranBarangNow
exports.getGajiPegawai = getGajiPegawai
exports.getGajiPegawaiNow = getGajiPegawaiNow
exports.getPengeluaranBarangById = getPengeluaranBarangById
exports.deletePengeluaranBarangById = deletePengeluaranBarangById
exports.deletePemasukanById = deletePemasukanById
exports.getLaporanUtama = getLaporanUtama
exports.getLaporanUtamaNow = getLaporanUtamaNow