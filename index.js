const express = require('express')
const app = express()
const path=require('path')
app.use(express.urlencoded({extended: true}))


  // app.use(express.static(__dirname,'/'))


app.use('/',require('./login-signup'))

app.listen(8080,()=>{console.log('listening at 8080')})