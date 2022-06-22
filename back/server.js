require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const {authenticate} = require('./logic/modules/authentication')

const ladderRouter = require('./routes/ladder')
const generalRouter = require('./routes/general')
const statsRouter = require('./routes/stats')


app.use(express.json())
app.use(authenticate)
app.use(ladderRouter)
app.use(generalRouter)
app.use(statsRouter)



const PORT = process.env.PORT || '8080'

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})