const ctrl = {}
const model = require('../models/modelBooking')
const respone = require('../utils/respon')

ctrl.getData = async (req,res) => {
    try{
        const id_user = req.params.id
        const result =  await model.getAllBooking({id_user})
        return res.status(200).json(result)
    }catch(error){
        console.log(error)
    }
}

// ctrl.saveData = async (req,res) => {
//     try {
//         return authCheck('user')(req,res, () => {
//     const {id_movie, seat_user, id_schedule, total_payment} = req.body
// })
//         const {
//             id_movie, seat_user, id_schedule, total_payment
//         } = req.body

//         const result = await model.addBooking({
//             id_movie, seat_user, id_schedule, total_payment
//         })
//         return res.status(200).json(result)
//     } catch (error) {
//         console.log(error)
//     }
// }


//version kak ebi 
// ctrl.saveData = async (req,res) => {
//     try {
//         const result = await model.save(req.body)
//         console.log(result)
//         return res.status(200).json(result)
//     } catch (error) {
//         console.log(error)
//     }
// }


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
        console.log(error)
        return respone(res, 500, error.message)
    }
}







ctrl.saveData = async (req,res) => {
    try {
        const {
            id_movie, seat_user, id_schedule, total_payment, id_order, id_user
        } = req.body

        const result = await model.addBooking({
            id_movie, seat_user, id_schedule, total_payment, id_order, id_user
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}



ctrl.delData = async (req,res) =>{
    try {
        const id_order  = req.params.id
        // const {id_order}  = req.params.id
        const result = await model.deleteBooking({id_order})
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
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
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}
 

module.exports = ctrl