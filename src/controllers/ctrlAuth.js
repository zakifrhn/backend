const ctrl = {}
const model = require('../models/modelUsers')
const respone = require('../utils/respon')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt')

ctrl.login = async (req,res) => {
    try {
        const passDb = await model.getByUser(req.body.username)

        if(passDb.length <= 0){
            return respone(res, 401, 'username tidak terdaftar')
        }

        const passUser = req.body.pass
        const check = await bcrypt.compare(passUser, passDb[0].pass)

        if(check){
            const token = jwt.genToken(req.body.username)
            return respone(res,200, {
                message: 'Token created',
                token
             })
        }else{
            return respone(res, 401, 'password salah')
        }
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

// ctrl.checkRole = async(req,res,next) => {
//     if(req.user){
//         if(req.user.role == 'user'){
//             next()
//         }else{
//             res.status(403).send('Forbidden');
//         }
//     }else{
//         return (res, 401, error.message)
//     }
// }

//version ini webdesimplified
// let refreshTokens = []

// ctrl.refreshToken = async(req,res) => {
//     const refreshToken = req.body.token
//     if (refreshToken == null) return respone(res, 401, error.message)
//     if (!refreshTokens.includes(refreshToken)) return respone(res, 401, error.message)
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403)
//     const accessToken = generateAccessToken({ name: user.name })
//     res.json({ accessToken: accessToken })
//   })
// }

// ctrl.deleteToken =  async(req,res) => {
//     refreshTokens = refreshTokens.filter(token => token !== req.body.token)
//     return respone(res, 200)
// }

// ctrl.loginTokens = async(req,res) =>{

// }

// version other
// ctrl.lognTokens =  async( req, res ) =>{
//     const {username, pass} = req.body
//     if(username == 'test' && pass == 'test123'){
//         const user = {username: 'test'}
//         const accessToken =  jwt.tokenAdmin(user)
//         const refreshToken = jwt.generateRefreshToken(user)
        
//         res.json({accessToken, refreshToken})
//     }else{
//         respone(res, 401)
//     }
// }

// Route untuk pembaharuan token akses
ctrl.refreshTokenize =  (req,res) =>{
    const refreshToken = req.body.refreshToken
    if(!refreshToken){
        return respone(res, 401, 'akses tidak dikenali')
    }

    const decoded = jwt.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if(!decoded){
        return respone(res, 403, 'Forbidden')
    }

    // Token pembaruan valid, buat token akses baru
    const user = { username: decoded.username };
    const accessToken = jwt.generateAccessToken(user);

    // Kirim token akses baru sebagai respons
    res.json({ accessToken });
}

module.exports = ctrl