const ctrl = {}
const model = require('../models/modelSchedule')
const respone = require('../utils/respon')

ctrl.saveData = async (req,res) => {
    try {
        const {
            id_movie, 
            location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema
        } = req.body

        const result = await model.addSch({
            id_movie, 
            location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema
        })
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}

ctrl.delData = async (req,res) =>{
    try {
        const id_schedule  = req.params.id
        const result = await model.deleteSch({id_schedule})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}

ctrl.editData = async(req,res) => {
    try {
        const id_schedule =  req.params.id
        const {location_user, price_movie, updated_at} = req.body
        const result = await model.editSch({id_schedule,location_user, price_movie, updated_at})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}


ctrl.getData = async (req,res) => {
    try{
        const result =  await model.getAllSch()
        return respone(res, 200, result)
    }catch(error){
        return respone(res, 500, error.message)
    }
}


ctrl.fetchBy = async(req,res) =>{
    try {
        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            orderBy: req.query.orderBy || 'created_at',
            search: req.query.search
        }

        const result = await model.getBy(params)
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)        
    }
}
module.exports = ctrl