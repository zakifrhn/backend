const ctrl = {}
const model = require('../models/modelBooking')
const modelUser = require ('../models/modelUsers')
const respone = require('../utils/respon')
const user = require('../models/modelUsers')

ctrl.getData = async (req,res) => {
    try{
        const id_user = req.params.id
        const result =  await model.getAllBooking({id_user})
        return respone(res, 200, result)
    }catch(error){
        return respone(res, 500, error.message)
    }
}


ctrl.fetchBy = async (req, res) => {
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


ctrl.saveData = async (req,res) => {
    const user = await modelUser.dataExists(req.user)
    //console.log(user)
    const idUser = user[0].id_user
    //console.log(idUser)

    try {
        if(idUser == undefined) return respone(res, 400, 'Sorry You Must Be Logged In')

        const {
            id_movie, seat_user, id_schedule, total_payment, id_order
        } = req.body

        const result = await model.addBooking({
            id_movie, seat_user, id_schedule, total_payment, id_order, idUser
        })
        console.log(res)
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }


}



ctrl.delData = async (req,res) =>{
    try {
        const id_order  = req.params.id
        const result = await model.deleteBooking({id_order})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}

ctrl.editData = async(req,res) => {
    try {
        const id_order =  req.params.id
        const {
            id_movie, seat_user, id_schedule, total_payment,updated_at
        } = req.body
        const result = await model.editBooking({
            id_order, id_movie, seat_user, id_schedule, total_payment,
            updated_at})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}
 

module.exports = ctrl