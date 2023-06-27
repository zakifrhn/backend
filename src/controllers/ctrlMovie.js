const ctrl = {}
const model = require('../models/modelMovie')
const respone =  require('../utils/respon')


ctrl.getData = async (req,res) => {
    try{
        const result =  await model.getAllMovie()
        return respone(res, 200, result)
    }catch(error){
        return respone(res, 500, error.message)
    }
}

ctrl.saveData = async (req,res) => {
    try {
        if(req.file !== undefined){
            req.body.image_movie = req.file.path
        }    
        const result = await model.addMovie(req.body)
        return respone(res,200,result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}

ctrl.delData = async (req,res) =>{
    try {
        const id_movie = req.params.id;
        const result = await model.deleteMovie({id_movie})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}

ctrl.editData = async(req,res) => {
    try {
        if(req.file !== undefined){
            req.body.image_movie = req.file.path
        }

        const id_movie = req.params.id
        const {
            title_movie,
            image_movie,
            synopsis_movie, 
            updated_at
        } = req.body
        const result = await model.editMovie({id_movie,title_movie,image_movie,synopsis_movie,updated_at})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}


ctrl.getName = async(req,res) => {
    try {
        const title_movie = req.query.title_movie
        const result = await model.getName({title_movie})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}


ctrl.sortName = async(req,res) => {
    try {
        const result = await model.sortNameRelease()
        return respone(res, 200, result)
    } catch (error) {
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