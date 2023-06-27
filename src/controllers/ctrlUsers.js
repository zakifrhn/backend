const ctrl = {}
const model = require('../models/modelUsers')
const respone = require('../utils/respon')
const hash = require('../utils/hash')
const verify = require('../utils/verifyEmail')
const { verifyEmail } = require('./ctrlAuth')

ctrl.fetchData = async (req, res) => {
    try {
        const result = await model.getByUser(req.user)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.save = async (req, res) => {
    try {
        const hasPassword = await hash(req.body.pass)
        const email = req.body.email 
        const roles = req.body.roles || 'user'
        const params = {
            ...req.body,
            pass: hasPassword,
            roles: roles
        }

        const verifyEmail = verify.sendMail(mailOptions, function (err) {
            if (err) { 
                return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
             }
            return res.status(200).send('A verification email has been sent to ' + email.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
        });

        if( email.length > 0){
            return respone(res, 400, 'Sorry this email has been register')
        }
        if( roles == undefined ){
            return roles;
        }
        const result = await model.saveData(params)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.update = async (req, res) => {
    try {
        const result = await model.updateData(req.user)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.delete = async (req, res) => {
    try {
        const result = await model.deleteData(req.user)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

module.exports = ctrl
