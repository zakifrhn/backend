const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlGenre')

route.get('/', ctrl.fetchData)

module.exports = route