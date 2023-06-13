const respone =  require('../utils/respon')
const jwt = require('jsonwebtoken')

const authCheck = (...roles) => {
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

            roles.forEach((v) => {
                if (v == decode.role) {
                    isValid = true
                    return
                }
            })

            console.log(decode)

            if (isValid) {
                req.user = decode.data
                return next()
            } else {
                return respone(res, 401, 'anda tidak punya akses')
            }
        })
    }
}

// const verifyAccesToken = (req,res, next) =>{
//     const authHeader =  req.headers['Authorization']
//     const token = authHeader && authHeader.split('') [1]
//     if(!token){
//         return (res, 401, error.message)
//     }

//     const decoded =  jwt.verifyToken(token, process.env.SECRET)
//     if(!decoded){
//         return respone(res, 401, 'Forbidden  ')
//     }

//     req.user = decoded
//     next()
// }




module.exports = authCheck
    // verifyAccesToken
