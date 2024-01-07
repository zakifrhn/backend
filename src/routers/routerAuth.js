const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlAuth')

route.post('/', ctrl.login)
route.post('/refresh-token', ctrl.refreshTokenize)
route.get('/:token', ctrl.verifyEmail)



module.exports = route