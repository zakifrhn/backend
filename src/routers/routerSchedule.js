const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlSchedule')
const authCheck = require('../middleware/authCheck')


route.post('/insert', authCheck('admin'), ctrl.saveData);
route.delete('/delete/:id', authCheck('admin'), ctrl.delData);
route.put('/edit/:id', authCheck('admin'), ctrl.editData);
route.get('/', ctrl.fetchBy)

module.exports = route