const connection = require('./connection')
const axios = require('axios').default
const dbSumm = require('../database/summoner')
const dbIcon = require('../database/profileIcon')
const leagueControl = require('./leagueControl')
const gH = require('./generalHelp')
const dbSummInt = require('../database/interface/summoner')



const checkSummoner = async summName => {
  try{
    var res = await dbSumm.getSummonerDB(gH.toRegexUppercase(summName))
    if(res.length > 0){
      console.log("Summoner in DB")
    }else{
      console.log("Requesting Summoner")
      const resAPI = await requestSummoner(summName)
      const resAddSumm = await dbSumm.addSummonerDB(resAPI)
      const resAddProIcon = await dbIcon.addSummonerIcon(resAPI)
      res = await dbSumm.getSummonerDB(gH.toRegexUppercase(summName))
      await leagueControl.requestLeague(res[0].id)
    }    
    console.log(res)
    return res
  }catch(e){
    console.log(e)
    return 'The summoner was not found'
  }
}

const updateSummoner = async summName => {
  try{

  }catch(e){
    console.log(e)
  }
}

const requestSummoner = async summName => {
  try{
    const encSummName = encodeURI(summName) 
    var flag = true
    var response = []   
    while(flag){
      response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encSummName}`,connection.config)
      flag = await gH.waitLimit(response)
    }
    console.log(response.data)
    return response.data
  }catch(e){
    console.log(e)
  }  
}

const summonerPage = async data => {
  try{
    const name = gH.toRegexUppercase(data.summonerName)
    if ('start' in data){
      return await dbSummInt.getMatches(name,parseInt(data.start),10)
    }
    return await dbSummInt.getSummonerInfo(name,10)


  }catch(e){
    console.log('Summoner page error :',e)
  }
}



module.exports = {
  checkSummoner,
  requestSummoner,
  summonerPage,
}