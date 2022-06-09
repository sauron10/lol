const connection = require('./connection')
const axios = require('axios').default
const dbLeague = require('../database/league')
const dbSummoner = require('../database/summoner')
const gH = require('./generalHelp')



const checkLeague = async summId => {
  try{
    const league = await dbLeague.getLeagueRel(summId)
    if (league.length < 1){
      return await requestLeague(summId)
    }
    return league
  }catch(e){
    console.log("There was an error searching for the summoner league")
  }
}

const requestLeague = async summId => {
  try{
    var flag = true
    var res = []
    while (flag){
      await gH.timer()
      res = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summId}`,connection.config)
      flag = await gH.waitLimit(res)
    }
    await res.data.forEach(async(league) => {
      // console.log(league)
      await dbLeague.addLeague(league)
      await dbLeague.addLeagueRel(league)
    })
    
    
  }catch(e){
    console.log(e)
  }
}



const populateLeague = async () => {
  try{
    const summList = await dbSummoner.getSummonerList()
    for (const summoner of summList){
      const leagueRel = await dbLeague.getLeagueRel(summoner.id)
      if (leagueRel.length < 1){
        await requestLeague(summoner.id)
      }
    }
    const summListNames = summList.map(summoner => summoner.summoner_name)
    return {'Added' : summListNames}

  }catch(e){
    console.log('Error at populateLeague : ',e)
  }
}

module.exports = {
  requestLeague,
  populateLeague,
  checkLeague,
}

