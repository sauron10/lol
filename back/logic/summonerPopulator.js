const res = require('express/lib/response')
const dbSumm = require('../database/summoner')
const connection = require('./connection')
const axios = require('axios').default
const gH = require('./generalHelp')
const summLs = require('./files/platinum')
const mC = require('./matchControl')
// const summoner


const ladderPopulator = async () => {
  const divisions = ['IV','III','II','I']
  const tiers = ['IRON','BRONZE','SILVER','GOLD','PLATINUM','DIAMOND']
  const queues = ['RANKED_SOLO_5x5','RANKED_FLEX_SR','RANKED_FLEX_TT']
  var page = 1
  var data = ['miu']

  for (const tier of tiers){
    for (const division of divisions){
      while (data.length > 0){
        const response = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${tier}/${division}?page=${page}`,connection.config)
        data = response.data
        data.forEach(async(summoner) => {
          const dbSummoner = await dbSumm.getSummonerDB(summoner.summonerName)
          if (!dbSummoner[0]){
            await dbSumm.addSummonerDB({
              'id': summoner.summonerId,
              'name' : summoner.summonerName,

            })
          }
        })
        page +=1
      }
    }
  }
}

const summonerList  = async () => {
  for (const summoner of summLs.summList) {
    console.log(summoner)
    await mC.checkMatch(summoner.summoner_name)
  }
}

module.exports = {
  ladderPopulator,
  summonerList,
}