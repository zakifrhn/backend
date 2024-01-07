const ctrl = {}
const model = require('../models/modelUsers')
const respone = require('../utils/respon')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt')
const jwtVerify = require('jsonwebtoken')

ctrl.login = async (req,res) => {

try {
    const dataUser = await model.getByUser(req.body.username)
    const passDb = await model.getByPassword(req.body.username)
    if (!passDb) {
        return respone(res, 401, 'username tidak terdaftar')
    }

    const cekEmail = await model.readStatus(req.body.username)
    if(cekEmail == 'false'){
        return respone(res, 400, 'Please verification email first!')
    }

    const role = await model.getByRole(req.body.username)
    const passUser = req.body.pass
    const check = await bcrypt.compare(passUser, passDb)
    if (check) {
        const token= jwt.genToken(req.body.username, role)
        return respone(res, 200, {
            message: 'token created',
            token: token.refreshToken,
            role,
            dataUser
        })
    } else {
        return respone(res, 401, 'password salah')
    }
} catch (error) {
    console.log(error)
    return respone(res, 500, error.message)
}
}



ctrl.verifyEmail = async (req, res) => {
    try{
    const { token } = req.params
    console.log(token)


    jwtVerify.verify(token, process.env.KEY, (err, decoded)=> {
        if (err) {
            console.log(err);
            return res.send({status: 404, message: "verification fail"});
        }
        req.email= decoded
        console.log(req.email)
    })
    if(req.email){
        const params = {
            email: req.email,
            status: 'active'
        }

        await model.updateStatus(params)
        return res.send({
            status: 201,
            message: 'Verification Successs'
        })
    }
    }
    catch(error){
        console.log(error)
        throw error
    }
}


// Route untuk pembaharuan token akses
ctrl.refreshTokenize = async (req,res) =>{

        //console.log(refresh)
        const {authorization} = req.headers
        //console.log(authorization)
    
        if(!authorization){
            return respone(res, 401, 'token tidak ada')
        }
        try {
        const tokenJWT = authorization.replace('Bearer ', '')
        //console.log(tokenJWT)
        
            jwtVerify.verify(tokenJWT, process.env.REFRESH_TOKEN_SECRET , (err, decoded)=> {
            if (err) {
                console.log(err);
                return res.send({status: 404, message: "token is empty"});
            }
            req.body = decoded
        })

        const data = req.body
        const username = data.username
        console.log(data)

        const role = await model.getByRole(data.data)
        //console.log(role)
        const token= jwt.genToken(username, role)
        return respone(res, 200, {
            message: 'token created',
            token: token.refreshToken,
            role: role
        })

        } catch (error) {
            console.log(error)
        }
}

module.exports = ctrl