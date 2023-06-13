const express =  require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlUsers')
const authCheck = require('../middleware/authCheck')

route.get('/', authCheck, ctrl.fetchData)
route.post('/', ctrl.save)
route.patch('/', ctrl.update)
route.delete('/', ctrl.delete)

module.exports = route