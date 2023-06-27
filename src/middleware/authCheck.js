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

            // user_id.forEach((v) => {
            //     if( v == decode.id_user){
            //         isValid = true
            //         return
            //     }
            // })

            // const user_id =  decode.id_user
            // console.log(user_id)

            if (isValid) {
                req.user = decode.data
                req.user_id = decode.user_id
                console.log("test")
                console.log(req.user)
                return next()
            } 
            else {
                return respone(res, 401, 'anda tidak punya akses')
            }
        })

//         // const userId = token.id_user
//         // if(req.body.id_user && req.body.id_user !== userId){
//         //     throw 'Invalid user ID';
//         //   } else {
//         //     next();
//         //     console.log(userId)
//         //   }
    }
}





module.exports = authCheck
