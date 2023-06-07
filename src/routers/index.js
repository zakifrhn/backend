const express = require('express')
const route =  express.Router()
const routerMovie = require('./routerMovie')
const routerSchedule = require('./routerSchedule')
const routerBooking = require('./routerBooking')

route.use('/movie', routerMovie)
route.use('/schedule', routerSchedule)
route.use('/booking', routerBooking)

module.exports = route