const connection = require('./connection')
const axios = require('axios').default
const dbSumm = require('../database/summoner')
const dbIcon = require('../database/profileIcon')
const mC = require('../logic/matchControl')
const leagueControl = require('./leagueControl')
const gH = require('./generalHelp')
const dbSummInt = require('../database/interface/summoner')
const intChamps = require('../database/interface/bestChamps')
const intPlayed = require('../database/interface/playedWith')
const { getMatch } = require('../database/match')


const checkSummoner = async summName => {
  try{
    var res = await dbSumm.getSummonerDB(summName)
    if(res.length < 1){
      console.log("Requesting Summoner")
      const resAPI = await requestSummoner(summName)
      const resAddSumm = await dbSumm.addSummonerDB(resAPI)
      const resAddProIcon = await dbIcon.addSummonerIcon(resAPI)
      res = await dbSumm.getSummonerDB(summName)
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
    let flag = true
    let response = []   
    while(flag){
      await gH.timer()
      response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encSummName}`,connection.config)
      flag = await gH.waitLimit(response)
    }
    console.log(response.data)
    return response.data
  }catch(e){
    console.log(e)
  }  
}

const summonerProfile = async data => {
  try{
    let {name} = data
    console.log(name)
    const [profile] = await dbSummInt.getProfile(name)
    return ({profile,status:200})

  }catch(e){
    console.log('Error getting summoner profile: ',e)
    return ({error: e, status:400})
  }
}

const summonerMatches = async data => {
  try{
    const sqlMatchList = (matchList) => {
      if (!matchList.length > 0) return null
      const joined = matchList.join("','")
      return `('${joined}')`
    }



    let {name,queue,size,champion,matchList} = data
    console.log({matchList})
    const [summ] = await checkSummoner(name)
    queue = queue == 1 ? null : `${queue}`
    champion = champion === '' ? null : `${champion}`
    let [info] = await dbSummInt.getMatches(name,queue,champion,0,size,sqlMatchList(matchList))
    const resMatches = info.matches ?? []
    if(resMatches.length < size ){
      await mC.requestMatchList(summ,queue,0,size)
      info = await dbSummInt.getMatches(name,queue,champion,0,size,sqlMatchList(matchList))
    }
    // const filMatches = resMatches.filter(m => !matchList.includes(m.match_id))
    // console.l(info)
    return ({matches:resMatches,status:200})
  }catch(e){
    console.log('Error getting summoner matches: ',e)
    return ({status:400,error:e})
    return 
  }
}

const updateSummoner = async (info) =>{
  try{
    queue = info.queue == 1 ? null : `${info.queue}`
    const [summoner] = await checkSummoner(info.summonerName)
    const league = await leagueControl.requestLeague(summoner.id)    
    // const matchList = await mCrequestMatchList(summoner,'',0,10)
    const name = summoner.summoner_name
    const [profile] = await dbSummInt.getProfile(name)
    console.log({name,queue})
    const [matches] = await dbSummInt.getMatches(name,queue,null,0,20,null)
    const resMatches = matches.matches ?? []
    // console.log('Summoner: ',res)
    return ({...profile,matches:resMatches})
  }catch(e){
    console.log('Error updating the summoner',e)
  }
}

const filterSummoner = async info => {
  try{
    const filters ={
      'champion' : 0,
      'win' : 0,
      'position': 0,
      ...info
    }

  }catch(e){
    console.log("Error in filterSummoner: ",e)
  }
}

const getSummonerSeason = async info => {
  try{
    // console.log(info)
    const [summoner] = await checkSummoner(info.summonerName)
    const matchList = await mC.getSeasonMatches(summoner,info.startTime)
    const savedMatches = await mC.saveMatchesList(matchList,summoner,10)
    return {...savedMatches,'list' : matchList}

  }catch(e){
    console.log('Error in get summoner season :',e)
  }
}

const getSummonerBestChamps = async info => {
  try{
    const [summoner] = await checkSummoner(info.summonerName)
    const champList = await intChamps.getBestChamps(summoner,info.queue)
    return champList
  }catch(e){
    console.log('Error in getSumonerBestChamps')
  }
}

const getPlayedWith = async info => {
  try{
    const {summonerName,queue} = info
    const queueAnd = queue != 1 ? `and m.queue_id = ${queue}`: ''
    const summonersPlayedWith = await intPlayed.playedWith(summonerName,queueAnd)
    return summonersPlayedWith
  }catch(e){
    console.log('Error getting played with :', e)
  }
}



module.exports = {
  checkSummoner,
  requestSummoner,
  summonerProfile,
  summonerMatches,
  updateSummoner,
  filterSummoner,
  getSummonerSeason,
  getSummonerBestChamps,
  getPlayedWith,
}