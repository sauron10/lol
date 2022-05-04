const connection = require('./connection')
const axios = require('axios').default
const dbLeague = require('../database/league')
const gH = require('./generalHelp')

const requestLeague = async summId => {
  try{
    const res = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summId}`,connection.config)
    await gH.delay(1600)
    await res.data.forEach(async(league) => {
      await dbLeague.addLeague(league)
      await dbLeague.addLeagueRel(league)
    })
    
    
  }catch(e){
    console.log(e)
  }
}

module.exports = {
  requestLeague,
}

