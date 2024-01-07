const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlMovie')
const upload = require('../middleware/upload')
const authCheck = require('../middleware/authCheck')



route.post('/insert', authCheck('admin'), upload.single('image_movie'), ctrl.saveData)
route.delete('/delete/:id',authCheck('admin'), ctrl.delData)
route.put('/edit/:id', upload.single('image_movie'), ctrl.editData)

route.get('/name', ctrl.getName)
route.get('/sort', ctrl.sortName)
route.get('/month', ctrl.getMonth)
route.get('/detail/:id', ctrl.getById)
route.get('/all', ctrl.getData)
route.get('/', ctrl.fetchBy)




module.exports = route