const respone =  require('../utils/respon')
const jwt = require('jsonwebtoken')

const authCheckId = (...id_user) => {
    return (req, res, next) => {
        const { authorization } = req.headers
        console.log(req.headers)
        let isValid = false

        if (!authorization) {
            return respone(res, 401, 'silahkan login terlebih dahulu')
        }

        const token = authorization.replace('Bearer ', '')
        jwt.verify(token, process.env.SECRET, (err, decode) => {
            if (err) {
                return respone(res, 401, err)
            }

            id_user.forEach((v) => {
                if (v == decode.user_id) {
                    isValid = true
                    return
                }
            })

            if (isValid) {
                req.id_user = decode.data
                return next()
            } else {
                return respone(res, 401, 'User tidak ditemukan')
            }
        })
    }
}

module.exports = authCheckId