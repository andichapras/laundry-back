const express = require('express')

const paketController = require('../controllers/paket-controller')

const router = express.Router()

router.get('/', paketController.getPaket)

router.get('/:pid', paketController.getPaketById)

router.patch('/:pid', paketController.updatePaketById)

module.exports = router