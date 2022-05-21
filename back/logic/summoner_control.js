const connection = require('./connection')
const axios = require('axios').default
const dbSumm = require('../database/summoner')
const dbIcon = require('../database/profileIcon')
const mC = require('../logic/matchControl')
const leagueControl = require('./leagueControl')
const gH = require('./generalHelp')
const dbSummInt = require('../database/interface/summoner')



const checkSummoner = async summName => {
  try{
    var res = await dbSumm.getSummonerDB(gH.toRegexUppercase(summName))
    if(res.length < 1){
      console.log("Requesting Summoner")
      const resAPI = await requestSummoner(summName)
      const resAddSumm = await dbSumm.addSummonerDB(resAPI)
      const resAddProIcon = await dbIcon.addSummonerIcon(resAPI)
      console.log('Ugly name',gH.toRegexUppercase(summName))
      res = await dbSumm.getSummonerDB(gH.toRegexUppercase(summName))
      console.log(res)
      await leagueControl.requestLeague(res[0].id)
    }else{
      console.log("Summoner in DB")
      await leagueControl.checkLeague(res[0].id)      
    }
    return res
  }catch(e){
    console.log(e)
    return 'The summoner was not found'
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
    const [summ] = await checkSummoner(data.summonerName)
    if ('queue' in data){ 
      const queue = data.queue === '1' ? '': `AND m.queue_id = ${data.queue}`
      const numericQueue = data.queue === '1' ? '': data.queue
      var info = await dbSummInt.getMatches(name,parseInt(data.start),10,queue)
      if (info[0].matches === null){  
        await mC.requestMatchList(summ,numericQueue,data.start,10)
        info = await dbSummInt.getMatches(name,parseInt(data.start),10,queue)
      }
      return info
    }
    if ('start' in data){
      return await dbSummInt.getMatches(name,parseInt(data.start),10)
    }
    return await dbSummInt.getSummonerInfo(name,10,'')


  }catch(e){
    console.log('Summoner page error :',e)
  }
}

const updateSummoner = async (info) =>{
  try{
    console.log('Updating summoner')
    const safeQueue = info.queue == '1' ? '': info.queue
    const [summoner] = await checkSummoner(info.summonerName)
    console.log('summoner', summoner)
    const league = await leagueControl.requestLeague(summoner.id)
    const query = safeQueue != '' ? `AND m.queue_id = ${safeQueue}` : ''
    
    const matchList = await mC.requestMatchList(summoner,'',0,10)
    const name = gH.toRegexUppercase(summoner.summoner_name)
    return await dbSummInt.getSummonerInfo(name,10,query)

  }catch(e){
    console.log('Error updating the summoner',e)
  }
}



module.exports = {
  checkSummoner,
  requestSummoner,
  summonerPage,
  updateSummoner,
}