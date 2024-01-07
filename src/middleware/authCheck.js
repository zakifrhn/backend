const respone =  require('../utils/respon')
const jwt = require('jsonwebtoken')


//     return (req, res, next) => {
//         const { authorization } = req.headers
//         console.log(req.headers)
//         let isValid = false
//         let isAdmin = false

//         if (!authorization) {
//             return respone(res, 401, 'silahkan login terlebih dahulu')
//         }

//         const token = authorization.replace('Bearer ', '')
//         jwt.verify(token, process.env.SECRET, (err, decode) => {
//             if (err) {
//                 return respone(res, 401, err)
//             }

//             if(decode.data.roles == 'user'){
//                 isValid= true
//                 console.log(isValid)
//             }

//             req.id = decode.id_user
//             console.log(req.id)

//             roles.forEach((v) => {
//                 if (v == decode.role) {
//                     isValid = true
//                     return
//                 }
//             })

//             user_id.forEach((v) => {
//                 if( v == decode.id_user){
//                     isValid = true
//                     return
//                 }
//             })

//             const user_id =  decode.id_user
//             console.log(user_id)

//             if (isValid) {
//                 req.user_id = decode.data.user_id
//                 // req.id = decode.data
//                 req.role = decode.role
//                 console.log("test")
//                 console.log(req.user_id)
//                 // console.log(req.id)
//                 console.log(req.role)
//                 return next()
//             }
//             else if(decode.data.roles == 'admin') {
//                 isAdmin = true
//                 console.log(isAdmin)
//             }

//             if (isAdmin) {
//                 req.user_id = decode.data.user_id
//                 // req.id = decode.data
//                 req.role = decode.role
//                 console.log("test")
//                 console.log(req.user_id)
//                 // console.log(req.id)
//                 console.log(req.role)
//                 return next()
//             }
//             else{
//                 return respone(res, 401, 'anda tidak punya akses')
//             } 

//         })

//     }
// }

// const authCheck = (...roles) => {
//     return (req, res, next) => {
//         const { authorization } = req.headers
//         console.log(req.headers)
//         let isValid = false
//         let isAdmin = false

//         if (!authorization) {
//             return respone(res, 401, 'silahkan login terlebih dahulu')
//         }

//         const token = authorization.replace('Bearer ', '')
//         console.log(token)
//         jwt.verify(token, process.env.SECRET, (err, decode) => {
//             if (err) {
//                 return respone(res, 401, err)
//             }

//             if(decode.data.roles == 'user'){
//                 isValid= true
//                 console.log(isValid)
//             }
//             console.log(decode.data.roles)
//             roles.forEach((v) => {
//                 if (v == decode.role) {
//                     isValid = true
//                     return
//                 }
//             })


//             if (isValid) {
//                 req.role = decode.role
//                 console.log("test")
//                 console.log(req.role)
//                 return next()
//             }
//             else if(decode.data.roles == 'admin') {
//                 isAdmin = true
//                 console.log(isAdmin)
//             }

//             if (isAdmin) {
//                 req.role = decode.role
//                 console.log(req.role)
//                 return next()
//             }
//             else{
//                 return respone(res, 401, 'anda tidak punya akses')
//             } 

//         })

//     }
// }


//code kak eby
const authCheck = (...roles) => {
    return (req, res, next) => {
        const { authorization } = req.headers
        let isValid = false

        if (!authorization) {
            return respone(res, 401, 'silahkan login terlebih dahulu')
        }

        const token = authorization.replace('Bearer ', '')
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) {
                return respone(res, 401, err)
            }

            roles.forEach((v) => {
                if (v == decode.role) {
                    isValid = true
                    return
                }
            })
            if (isValid) {
                req.user = decode.data
                return next()
            } else {
                return respone(res, 401, 'anda tidak punya akses')         
            }
        })
    }
}





module.exports = authCheck 
