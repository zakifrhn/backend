const jwt =  require('jsonwebtoken')

module.exports = {
    genToken: (data, role) => {
        const payload = {
            data: data,
            role: role
        }

        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '5s' })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'24h'})
        return {
            token, refreshToken
        }
    }

}