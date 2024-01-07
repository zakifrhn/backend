const express = require('express')
const app = express()
const routers = require('./src/routers/index')
const db =  require('./src/config/db')
const cors = require('cors')
const cloudinary = require('cloudinary').v2

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routers)
db.connect()
.then(() => {

    cloudinary.config({
        cloud_name: process.env.CD_NAME,
        api_key: process.env.CD_KEY,
        api_secret: process.env.CD_SECRET
    })  

    app.listen(process.env.PORT,() => {
        console.log('app running on port 5200');
    })
})
.catch(e => {
    console.log(`your port ${e} is not recongnize`)
})