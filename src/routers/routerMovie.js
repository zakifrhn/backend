const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlMovie')
const upload = require('../middleware/upload')
const authCheck = require('../middleware/authCheck')


route.post('/insert', authCheck('admin'), upload.single('image_movie'), ctrl.saveData)
route.delete('/delete/:id', authCheck('admin'), ctrl.delData)
route.put('/edit/:id', authCheck('admin'), upload.single('image_movie'), ctrl.editData)

route.get('/name', authCheck('admin'), ctrl.getName)
route.get('/sort', ctrl.sortName)
route.get('/', ctrl.fetchBy)



module.exports = route