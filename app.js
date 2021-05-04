const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const paketRoutes = require('./routes/paket-routes')
const transaksiRoutes = require('./routes/transaksi-routes')
const laporanRoutes = require('./routes/laporan-routes')
// const userRoutes = require('./routes/user-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})

app.use('/paket', paketRoutes)
app.use('/transaksi',transaksiRoutes)
app.use('/laporan', laporanRoutes)
// app.use('/user', userRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'an unknown error occured'})
})

mongoose
    .connect('mongodb+srv://belajar:senyuman25@mern.tr8rx.mongodb.net/skripsi?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err)
    })