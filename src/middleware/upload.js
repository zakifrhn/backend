const multer = require('multer')
// const express = require('express')
const path = require('path')

const storage = multer.diskStorage({
    //if you want the file also has been save in your device
    //destination: 'public/upload',
    filename: (req,file,cb) => {
        cb(null, 
            path.parse(file.originalname).name + "-"+
            Date.now() + path.extname(file.originalname)
          )
    }
})


const filter = (req,file,cb) => {
    if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true)
    }else{
        req.errorFileFIlter = 'File extensions are not supported'
        cb(null,false)
    }
}


module.exports = multer({
    storage: storage,
    fileFilter: filter
})