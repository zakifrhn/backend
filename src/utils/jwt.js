const jwt =  require('jsonwebtoken')

module.exports = {
    genToken: (data) => {
        const payloadAmin = {
            data: data,
            role: 'admin'
        }

        const payloadUser = {
            data: data,
            role: 'user'
        }

        const tokenAdmin = jwt.sign(payloadAmin, process.env.SECRET, { expiresIn: '10h'})
        const tokenUser = jwt.sign(payloadUser, process.env.SECRET, { expiresIn: '10h'})

        const generateRefreshToken = jwt.sign(payloadAmin, process.env.REFRESH_TOKEN_SECRET);

        const verifyToken = (token, secret) => {
            try {
                const decoded = jwt.verify(token,secret)
                return decoded;
            } catch (err) {
                return null;
            }
        }
        return {
            tokenAdmin,
            tokenUser,
            generateRefreshToken,
            verifyToken
        }
    }
}