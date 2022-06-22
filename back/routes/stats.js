const express = require('express')
const router = express.Router()
const intStatsChamp = require('../database/interface/stats/championStats')
const intStatsItem = require('../database/interface/stats/itemStats')
const intStatsSummoner = require('../database/interface/stats/summonerStats')
 

// Champions
router.get('/champions/winrate/', async (req, res, next) => {
  const {queue,version} = req.query 
  const result = await intStatsChamp.championsByWinrate(queue,version)
  return res.json(result)
})

router.get('/champions/best/:champion/', async (req, res, next) => {
  const {queue,version} = req.query 
  const {champion} = req.params
  const result = await intStatsChamp.summonerChampionBestWinrate(champion,queue)
  return res.json(result)
})

router.get('/champions/lane/:champion/', async (req, res, next) => {
  const {champion} = req.params
  const {version} = req.query
  const result = await intStatsChamp.commonLaneForChampion(champion,version)
  return res.json(result)
})

router.get('/champions/against/:champion/', async (req, res, next) => {
  const {champion} = req.params
  const {position,queue} = req.query
  const result = await intStatsChamp.championVsChampionWinrate(champion,position,queue)
  return res.json(result)
})

//Items

router.get('/items/winrate/', async (req, res, next) => {
  const {queue,version} = req.query
  const result = await intStatsItem.itemByWinrate(queue,version)
  return res.json(result)
})

router.get('/items/common/:summoner/:champion/', async (req, res, next) => {
  const {queue,version} = req.query
  const {summoner,champion} = req.params
  const result = await intStatsItem.commonItemsBySummonerChampion(summoner,champion,queue,version)
  return res.json(result)
})

//Summoner
router.get('/patch/winrate/:summoner/', async (req, res, next) => {
  const {summoner} = req.params
  const {queue} = req.query
  const result = await intStatsSummoner.summonerWinrateByPatch(summoner,queue)
  return res.json(result)
})


module.exports = router