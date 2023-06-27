const express = require('express')
const route = express.Router()
const ctrl = require('../controllers/ctrlBooking')
const authCheck = require('../middleware/authCheck')
// const authCheckId = require('../middleware/authCheckId')

//? only user can access
route.post('/insert', authCheck('user'), ctrl.saveData);
route.get('/', authCheck('user'), ctrl.fetchBy);


//? only admin can access
route.delete('/delete/:id', authCheck('admin'), ctrl.delData);
route.put('/edit/:id', authCheck('admin'), ctrl.editData);

module.exports = route