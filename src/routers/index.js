const express = require('express')
const route =  express.Router()
const routerMovie = require('./routerMovie')
const routerSchedule = require('./routerSchedule')
const routerBooking = require('./routerBooking')
const routeUsers = require('./routerUsers')
const routerAuth = require('./routerAuth')
const routerGenre = require('./routerGenre')


route.use('/movie', routerMovie)
route.use('/schedule', routerSchedule)
route.use('/booking', routerBooking)
route.use('/users', routeUsers)
route.use('/genre' , routerGenre)
route.use('/auth', routerAuth)

module.exports = route