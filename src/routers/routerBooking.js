const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlBooking')


route.post('/insert', ctrl.saveData);
route.delete('/delete/:id', ctrl.delData);
route.put('/edit/:id', ctrl.editData);
route.get('/', ctrl.getData);
module.exports = route