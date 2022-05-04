const express = require('express')
const router = express.Router()
// const dbM  = require('../database/summoners')
const {checkSummoner} = require('../logic/riot_ladder')
const summonerControl = require('../logic/summoner_control')
const populators = require('../logic/populators')
const mC = require('../logic/matchControl')
const summonerPopulator = require('../logic/summonerPopulator')


router.get('/summoner/:summonerName', async (req,res,next) => {
  const result  = await summonerControl.checkSummoner(req.params.summonerName)
  return res.json(result)
})

router.get('/summonerList', async (req,res,next) => {
  const result  = await summonerPopulator.summonerList()
  return res.json(result)
})

router.get('/:summonerName', async (req,res,next) => {
  const result  = await summonerControl.summonerPage(req.params.summonerName)
  return res.json(result)
})


router.get('/populators/icon', async (req,res,next) => {
  const result = await populators.profileIconPopulator()
  return res.json(result)
})

router.get('/populators/champs', async (req,res,next) => {
  const result = await populators.championPopulator()
  return res.json(result)
})

router.get('/populators/items', async (req,res,next) => {
  const result = await populators.itemPopulator()
  return res.json(result)
})

router.get('/populators/spells', async (req,res,next) => {
  const result = await populators.summonerSpellPopulator()
  return res.json(result)
})

router.get('/populators/runes', async (req,res,next) => {
  const result = await populators.runesPopulator()
  return res.json(result)
})




router.get('/get/allChamps', async (req,res,next) => {
  const result = await populators.allChamps()
  return res.json(result)
})

router.get('/get/:summoner/matches', async (req,res,next) => {
  const result = await mC.checkMatch(req.params.summoner)
  return res.json({'result' : "done"})
})


module.exports = router