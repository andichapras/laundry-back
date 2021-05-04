const express = require('express')

const userController = require('../controllers/user-controller')

const router = express.Router()

router.get('/', userController.getUser)

router.post('/login', userController.login)

router.post('/spvMode', userController.spvMode)

module.exports = router