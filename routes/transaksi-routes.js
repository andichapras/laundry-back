const express = require('express')

const transaksiController = require('../controllers/transaksi-controller')

const router = express.Router()

router.get('/', transaksiController.getTransaksi)

router.post('/', transaksiController.createTransaksi)

router.get('/:transid', transaksiController.getTransaksiById)

router.patch('/:transid', transaksiController.finishTransaksi)

router.get('/status/kelola', transaksiController.getTransaksiByStatus)

router.get('/status/ambil', transaksiController.getTransaksiForAmbil)

router.patch('/customer/nota/:transnota', transaksiController.ambilTransaksiByNota)

router.get('/customer/nama/:cusnama', transaksiController.getTransaksiByCustomer)
// router.patch('/customer/nama/:ambilnama', transaksiController.ambilTransaksiByNama)

router.get('/customer/email/:cusmail', transaksiController.getTransaksiByEmail)
// router.patch('/customer/email/:cusmail', transaksiController.ambilTransaksiByEmail)

router.get('/customer/telepon/:custelp', transaksiController.getTransaksiByTelepon)
// router.patch('/customer/telepon/:custelp', transaksiController.ambilTransaksiByTelepon)

module.exports = router