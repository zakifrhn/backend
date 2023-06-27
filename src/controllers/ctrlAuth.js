const ctrl = {}
const model = require('../models/modelUsers')
const respone = require('../utils/respon')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt')

ctrl.login = async (req,res) => {
    try {
        const passDb = await model.getByUser(req.body.username)
        console.log(passDb)

        if(passDb.length <= 0){
            return respone(res, 401, 'username tidak terdaftar')
        }

        const passUser = req.body.pass
        const check = await bcrypt.compare(passUser, passDb[0].pass)

        if(check){
            const token = jwt.genToken({username: req.body.username, roles: passDb[0].roles, user_id: passDb[0].id_user})
            return respone(res,200, {
                message: 'Token created',
                token
             })
        }else if(!passDb[0].verify){
            return respone(res, 401, 'Your email has not been verified. Please click on resend')
        }else{
            return respone(res, 401, 'password salah')
        }
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.verifyEmail = (req, res) => {
    const { token } = req.params

    jwt.verify(token, 'ourSecretKey', function(err, decoded) {
        if (err) {
            console.log(err);
            res.send(`Email verification failed, possibly the link is invalid or expired`);
        }
        else {
            res.send("Email verifified successfully");
        }
    });
}


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