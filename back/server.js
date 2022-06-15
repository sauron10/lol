require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const authentication = require('./logic/modules/authentication')

const ladderRouter = require('./routes/ladder')
const generalRouter = require('./routes/general')


app.use(express.json())
app.use(authentication.authenticate)
app.use(ladderRouter)
app.use(generalRouter)



const PORT = process.env.PORT || '8080'

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})