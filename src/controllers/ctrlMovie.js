const ctrl = {}
const model = require('../models/modelMovie')
const respone =  require('../utils/respon')
const upload = require('../utils/upload')


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
            req.body.image_movie = await upload(req.file.path)
            console.log(req.body.image_movie)
        }
        const {
            title_movie, 
            release_date,  
            directed_by, 
            duration, 
            casts_movie, 
            image_movie, 
            synopsis_movie,
            id_genre
        }=req.body
        const result = await model.addMovie({title_movie, 
            release_date,  
            directed_by, 
            duration, 
            casts_movie, 
            image_movie, 
            synopsis_movie,
            id_genre})
            console.error(result)
        console.log(req.body.image_movie)
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
        console.log(error)
        return respone(res, 500, error.message)
    }
}

ctrl.editData = async(req,res) => {
    try {
        if(req.file !== undefined){
            req.body.image_movie = await upload (req.file.path)
            console.log(req.body.image_movie)
        }
        const id_movie = req.params.id
        const { 
            title_movie,
            image_movie,
            synopsis_movie, 
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            genre} = req.body
        const result = await model.editMovie({    
            id_movie, 
            title_movie,
            image_movie,
            synopsis_movie, 
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            genre})
        console.log(result)
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 500, error.message)
    }
}


ctrl.getName = async(req,res) => {
    try {
        const title_movie = req.query.title_movie
        const result = await model.getName(title_movie)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
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

ctrl.getMonth = async(req,res) =>{
    try {
        
        const release_date = req.query.month
        const result = await model.getByMonth({release_date})
        console.log(result)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone (res, 500, error.message)
    }
}

ctrl.fetchBy = async(req,res) =>{
    try {
        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            orderBy: req.query.orderBy || 'created_at',
            search: req.query.search,
            genre: req.query.genre,
            month: req.query.month || ''
        }

        const result = await model.getBy(params)
        console.log(result)
        return respone(res, 200, result)
    } catch (error) {
        console.log(error)
        return respone(res, 500, error.message)        
    }
}

ctrl.getById =  async(req,res) => {
    try {
        const id_movie = req.params.id
        const result = await model.getDetail({id_movie})
        return respone(res, 200, result)
    } catch (error) {
        return respone(res, 400, 'Data Not Found')
    }
}

module.exports = ctrl