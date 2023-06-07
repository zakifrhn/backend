const express = require('express')
const app = express()
const routers = require('./src/routers/index')
const db =  require('./src/config/db')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routers)


db.connect()
.then(() => {
    app.listen(5200,() => {
        console.log('app running on port 5200');
    })
})
.catch(e => {
    console.log(`your port ${e} is not recongnize`)
})