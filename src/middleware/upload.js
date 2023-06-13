const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: 'public/upload',
    filename: (req,file,cb) => {
        cb(null, 
            path.parse(file.originalname).name + "-"+
            Date.now()+ path.extname(file.originalname)
          )
    }
})


const filter = (req,file,cb) => {
    if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}


module.exports = multer({
    storage: storage,
    fileFilter: filter
})