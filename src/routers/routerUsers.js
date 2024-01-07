const express =  require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlUsers')
const authCheck = require('../middleware/authCheck')
const verifyEmail = require('../middleware/verifyAccountEmail')
const upload = require('../middleware/upload')

route.get('/',authCheck('user', 'admin'), ctrl.fetchData)
route.post('/',verifyEmail, ctrl.save)
route.patch('/', authCheck('user', 'admin'), ctrl.update)
route.put('/', authCheck('user', 'admin'), ctrl.updatePass)
route.put('/update/img', authCheck('user', 'admin'), upload.single('image_user'), ctrl.updateImgUser)
route.delete('/', ctrl.delete)

module.exports = route