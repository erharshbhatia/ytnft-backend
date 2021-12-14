const express = require('express')
const mongoose = require('mongoose')
const {MONGOURI} =require('./keys')
const cors = require('cors')
require("dotenv").config()

require('./models/mintedVideo')
require('./models/user')

const app=express()


app.use(express.json())
//app.use(cors())
app.use(require('./routes/user'))
app.use(require('./routes/video'))


mongoose.connect(MONGOURI, 
    {useNewUrlParser: true, 
    useUnifiedTopology: true})

mongoose.connection.on('connected', ()=>{
    console.log("Connected to mongo ")
})

mongoose.connection.on('error', (err)=>{
    console.log("error in connecting ", err)
})


const PORT= process.env.PORT || 5000
app.listen(PORT, ()=>console.log(`serving is running at ${PORT}`))