const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlMovie')



route.post('/insert', ctrl.saveData);
route.delete('/delete/:id', ctrl.delData);
route.put('/edit/:id', ctrl.editData);
route.get('/name', ctrl.getName)
route.get('/sort', ctrl.sortName)
route.get('/', ctrl.getData);

module.exports = route