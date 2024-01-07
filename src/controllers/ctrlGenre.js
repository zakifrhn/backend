const ctrl = {}
const model = require('../models/modelGenre')
const respone = require('../utils/respon')

ctrl.fetchData = async (req, res) => {
    try {
        const result = await model.getData()
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)
    }
}

module.exports = ctrl
