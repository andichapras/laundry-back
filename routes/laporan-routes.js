const express = require('express')

const laporanController = require('../controllers/laporan-controller')

const router = express.Router()

router.get('/', laporanController.getLaporanUtama)

router.get('/now', laporanController.getLaporanUtamaNow)
// router.get('/now/masuk', laporanController.getLaporanPemasukanNow)
// router.get('/now/keluar', laporanController.getLaporanPengeluaranNow)

router.get('/barang', laporanController.getPengeluaranBarang)

// router.get('/barang/:barangid', laporanController.getPengeluaranBarangById)

router.post('/barang', laporanController.createPengeluaranBarang)

// router.delete('/barang/:barangid', laporanController.deletePengeluaranBarangById)

router.get('/barang/now', laporanController.getPengeluaranBarangNow)

router.get('/gaji', laporanController.getGajiPegawai)

router.post('/gaji', laporanController.createGajiPegawai)

router.get('/gaji/now', laporanController.getGajiPegawaiNow)

// router.get('/keluar', laporanController.getLaporanPengeluaran)

// router.get('/masuk', laporanController.getLaporanPemasukan)

module.exports = router
