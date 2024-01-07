const bcrypt = require('bcrypt')

async function hashPassword(pass){
    try {
        const salt = await bcrypt.genSalt(10)
        const result = await bcrypt.hash(pass, salt)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = hashPassword 