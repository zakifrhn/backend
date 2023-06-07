const ctrl = {}
const model = require('../models/modelMovie')

ctrl.getData = async (req,res) => {
    try{
        const result =  await model.getAllMovie()
        return res.status(200).json(result)
    }catch(error){
        console.log(error)
    }
}

ctrl.saveData = async (req,res) => {
    try {
        const {
            title_movie, 
            genre_movie,  
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie ,
            date_user,
            kota_user
        } = req.body

        const result = await model.addMovie({
            title_movie, 
            genre_movie,  
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie ,
            date_user,
            kota_user
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.delData = async (req,res) =>{
    try {
        // const { id_movie } = req.body
        const id_movie = req.params.id;
        const result = await model.deleteMovie({id_movie})
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.editData = async(req,res) => {
    try {
        const id_movie = req.params.id;
        const {title_movie, date_user,kota_user,updated_at} = req.body
        const result = await model.editMovie({id_movie, title_movie, date_user,kota_user,updated_at})
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}


ctrl.getName = async(req,res) => {
    try {
        const title_movie = req.query.title_movie
        const result = await model.getName({title_movie})
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}


ctrl.sortName = async(req,res) => {
    try {
        // const title_movie = req.query.title_movie
        // const relase_date = req.query.relase_date
        const result = await model.sortNameRelease()
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

module.exports = ctrl