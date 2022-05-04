const express = require('express')
const router = express.Router()
const {getLadder,addToDatabase,populatePuuid} = require('../logic/riot_ladder')
const {getAllSummoners} = require('../database/summoners')

router.get('/ladder/:div/:rank',(req,res,next) => {
  getLadder(req.params.div,req.params.rank)
    .then((data) => {
      return res.json({division:req.params.div, rank : req.params.rank, data: data.data })
    })

    
})

router.get('/ladder',(req,res,next) => {
  getAllSummoners('*','').then(data => {
    console.log(data)
    return res.json({data : data})
  })
})

router.get('/up_ladder',(req,res,next) => {
  const divisions = ['IRON','BRONZE','SILVER','GOLD','PLATINUM','DIAMOND']
  const ranks = ['IV','III','II','I']
  
  divisions.forEach((division,dIndex) => {
    ranks.forEach((rank,rIndex) => {
      // setTimeout(() => {
        // start = Date.now()
        getLadder(division,rank)
        .then((data) => addToDatabase(data))
      // },dIndex * 800000 + rIndex * 200000)      
    })
  })

  return res.send("Ok")
})



router.get('/test',(req,res,next) => {
  getLadder('DIAMOND','III')
  .then((data) => res.json(data))

})

router.get('/pop_puuid',(req,res,next) => {
  populatePuuid()
  .then(res.send("Ok"))
})

module.exports = router

