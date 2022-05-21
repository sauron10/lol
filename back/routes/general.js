const express = require('express')
const router = express.Router()
// const dbM  = require('../database/summoners')
const {checkSummoner} = require('../logic/riot_ladder')
const summonerControl = require('../logic/summoner_control')
const populators = require('../logic/populators')
const mC = require('../logic/matchControl')
const summonerPopulator = require('../logic/summonerPopulator')
const leagueControl = require('../logic/leagueControl')


router.get('/summoner/:summonerName', async (req,res,next) => {
  const result  = await summonerControl.checkSummoner(req.params.summonerName)
  return res.json(result)
})

router.get('/summonerList', async (req,res,next) => {
  const result  = await summonerPopulator.summonerList()
  return res.json(result)
})

router.get('/:summonerName/', async (req,res,next) => {
  const data =('start' in req.query) || ('queue' in req.query) ? {...req.params,...req.query} : req.params
  const result  = await summonerControl.summonerPage(data)
  return res.json(result)
})

router.get('/:summonerName/update', async (req,res,next) => {
  const result  = await summonerControl.updateSummoner({...(req.params),...(req.query)})
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

router.get('/populators/league', async (req,res,next) => {
  const result = await leagueControl.populateLeague()
  return res.json(result)
})


router.get('/get/allChamps', async (req,res,next) => {
  const result = await populators.allChamps()
  return res.json(result)
})

router.get('/get/:summoner/matches', async (req,res,next) => {
  const data = ('queue' in req.query) || ('start' in req.query) ||('count' in req.query) ? {...req.params,...req.query}:{...req.params,'queue':'','start':0,'count':20}
  const result = await mC.checkMatch(data)
  return res.json({'result' : "done"})
})


module.exports = router