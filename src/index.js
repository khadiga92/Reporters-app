const express = require('express')
const jwt = require('jsonwebtoken')

const reporterRouter = require('./routers/reporters')
const newsRouter = require('./routers/news')
const Reporter = require('./models/reporters')
const News = require('./models/news')
require('./db/mongoose')

const app = express()

app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log('Server is running')
})