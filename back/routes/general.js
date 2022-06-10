const express = require('express')
const router = express.Router()
const summonerControl = require('../logic/summoner_control')
const populators = require('../logic/populators')
const mC = require('../logic/matchControl')
const summonerPopulator = require('../logic/summonerPopulator')
const leagueControl = require('../logic/leagueControl')
const uC = require('../logic/user_control')


router.get('/favicon.ico', async(req,res,next) => res.status(404) )

router.get('/', async (req,res,next) => {
  return res.json({miau:'miau'})
})

router.get('/summoner/:summonerName', async (req,res,next) => {
  const result  = await summonerControl.checkSummoner(req.params.summonerName)
  return res.json(result)
})

router.get('/summonerList', async (req,res,next) => {
  const result  = await summonerPopulator.summonerList()
  return res.json(result)
})

//Front end

  //Login
router.post('/signup/',async (req,res,next) => {
  const result = await uC.createUser(req.body)
  return res.json(result)
})

router.post('/signin/',async (req,res,next) => {
  const result = await uC.signIn(req.body)
  return res.json(result)
})

router.get('/:summonerName/', async (req,res,next) => {
  const result = await summonerControl.summonerPage({...req.params,...req.query})
  return res.json(result)
})

router.get('/:summonerName/played', async (req,res,next) => {
  const result = await summonerControl.getPlayedWith({...req.params,...req.query})
  return res.json(result)
})

router.get('/:summonerName/update', async (req,res,next) => {
  const result  = await summonerControl.updateSummoner({...(req.params),...(req.query)})
  return res.json(result)
})

router.get('/:summonerName/filtered/', async (req,res,next) => {
  const result = await summonerControl.filterSummoner({...(req.params),...(req.query)})
  return res.json(result)
})

router.get('/:summonerName/season', async (req,res,next) => {
  const result = await summonerControl.getSummonerSeason({...req.params,...req.query})
  return res.json(result)
})

router.get('/:summonerName/champion/rank', async (req,res,next) => {
  const result = await summonerControl.getSummonerBestChamps({...req.params,...req.query})
  return res.json(result)
})

// Populators
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
  console.log('Getting runes')
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
