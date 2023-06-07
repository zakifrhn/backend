const ctrl = {}
const model = require('../models/modelBooking')

ctrl.getData = async (req,res) => {
    try{
        const result =  await model.getAllBooking()
        return res.status(200).json(result)
    }catch(error){
        console.log(error)
    }
}

ctrl.saveData = async (req,res) => {
    try {
        const {
            movie_id,
            pick_cinema,
            pick_date, 
            duration, 
            price,
            seat_user,
            total_payment
        } = req.body

        const result = await model.addBooking({
            movie_id,
            pick_cinema,
            pick_date, 
            duration, 
            price,
            seat_user ,
            total_payment
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
            pick_cinema,
            pick_date, 
            price,
            seat_user,
            total_payment,
            updated_at
        } = req.body
        const result = await model.editBooking({
            id_order, 
            pick_cinema,
            pick_date, 
            price,
            seat_user ,
            total_payment,
            updated_at})
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}


module.exports = ctrl