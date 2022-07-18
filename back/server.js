require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const {authenticate} = require('./logic/modules/authentication')
const {admin} = require('./logic/modules/adminAuth')

const {numReq} = require ('./logic/modules/maxReq')

const ladderRouter = require('./routes/ladder')
const generalRouter = require('./routes/general')
const statsRouter = require('./routes/stats')
const adminRouter  = require('./routes/admin')


app.use(express.json())
app.use(numReq)
app.use(authenticate)
app.use(admin)
app.use(ladderRouter)
app.use(generalRouter)
app.use(statsRouter)
app.use(adminRouter)



const PORT = process.env.PORT || '8080'

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})