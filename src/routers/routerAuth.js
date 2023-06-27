const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlAuth')

route.post('/', ctrl.login)
route.post('/refresh-token', ctrl.refreshTokenize)

route.get('/verify-email/:token', ctrl.verifyEmail)



module.exports = route