const model = require('../models/modelUsers')

const confirmEmail = async(req, res, next) => {
    try {
        const {email} = req.body
        const result = await model.emailExists(email)

        console.log(email)
        console.log(result)

        if(result == ''){
            return next()
        }

        if(email== result[0].email){
            return res.send({
                status: 400,
                message: 'Email has been registered'
            })
        }
    } catch (error) {
        return res.send(error)
    }
    
}

module.exports = confirmEmail