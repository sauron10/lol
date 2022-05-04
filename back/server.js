const express = require('express')

const app = express()

const ladderRouter = require('./routes/ladder')
const generalRouter = require('./routes/general')

app.use(ladderRouter)
app.use(generalRouter)

const PORT = process.env.PORT || '8080'

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})