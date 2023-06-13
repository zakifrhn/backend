const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlAuth')

route.post('/', ctrl.login)
route.post('/refresh-token', ctrl.refreshTokenize)
// route.delete('/logoutTokens', ctrl.refreshToken)
// route.post('/loginTokens', ctrl.loginTokens)
// route.post('/token', ctrl.refreshToken)



module.exports = route