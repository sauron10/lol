const express = require('express')
const router = express.Router()
const summonerControl = require('../logic/summoner_control')
const populators = require('../logic/populators')
const mC = require('../logic/matchControl')
const summonerPopulator = require('../logic/summonerPopulator')
const leagueControl = require('../logic/leagueControl')
const uC = require('../logic/user_control')
const sInt = require('../database/interface/summoner')


router.get('/favicon.ico', async (req, res, next) => res.status(404))

router.get('/', async (req, res, next) => {
  return res.json({ miau: 'miau' })
})

// router.get('/summoner/:summonerName', async (req,res,next) => {
//   const result  = await summonerControl.checkSummoner(req.params.summonerName)
//   return res.json(result)
// })

router.get('/summonerList', async (req, res, next) => {
  const result = await summonerPopulator.summonerList()
  return res.json(result)
})

//Front end

//Login
router.post('/signup/', async (req, res, next) => {
  const result = await uC.createUser(req.body)
  return res.status(result.status).json(result)
})

router.post('/signin/', async (req, res, next) => {
  const result = await uC.signIn(req.body)
  return res.json(result)
})

router.post('/summoner/:summonerName/', async (req, res, next) => {
  let result = {}
  switch (req.body.type) {
    case 'matches':
      result = await summonerControl.summonerMatches(req.body)
      return res.json(result)
    case 'profile':
      result = await summonerControl.summonerProfile(req.body)
      return res.json(result)
    case 'time':
      [result] = await sInt.wastedTime(req.body.name)
      return res.json(result)
    default:
      return res.status(400).json({error:'Didnt had type'})
  }
})

router.get('/summoner/:summonerName/played', async (req, res, next) => {
  const result = await summonerControl.getPlayedWith({ ...req.params, ...req.query })
  return res.json(result)
})

router.get('/summoner/:summonerName/update', async (req, res, next) => {
  const result = await summonerControl.updateSummoner({ ...(req.params), ...(req.query) })
  return res.json(result)
})

router.get('/summoner/:summonerName/filtered/', async (req, res, next) => {
  const result = await summonerControl.filterSummoner({ ...(req.params), ...(req.query) })
  return res.json(result)
})

router.get('/summoner/:summonerName/season', async (req, res, next) => {
  const result = await summonerControl.getSummonerSeason({ ...req.params, ...req.query })
  return res.json(result)
})

router.get('/summoner/:summonerName/champion/rank', async (req, res, next) => {
  const result = await summonerControl.getSummonerBestChamps({ ...req.params, ...req.query })
  return res.json(result)
})




router.get('/get/allChamps', async (req, res, next) => {
  const result = await populators.allChamps()
  return res.json(result)
})

router.get('/get/:summoner/matches', async (req, res, next) => {
  const data = ('queue' in req.query) || ('start' in req.query) || ('count' in req.query) ? { ...req.params, ...req.query } : { ...req.params, 'queue': '', 'start': 0, 'count': 20 }
  const result = await mC.checkMatch(data)
  return res.json({ 'result': "done" })
})


module.exports = router
