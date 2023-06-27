const jwt =  require('jsonwebtoken')
module.exports = {
    genToken: (data) => {
        const payload = {
            data: data.username,
            role: data.roles,
            user_id: data.id_user
        }
        // console.log('roles')
        // console.log(data)

        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '10h'})

        return {
            token
        }
        }
}