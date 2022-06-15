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

// const summonerPage = async data => {
//   try{
//     const name = data.summonerName
//     const [summ] = await checkSummoner(data.summonerName)
//     if('queue' in data){
//       const queue = data.queue === '1' ? '': `AND m.queue_id = ${data.queue}`
//       // console.log({champion : data.champion})
//       const champion = data.champion ? `AND cm.champion_id = ${data.champion}` : ''
//       const numericQueue = data.queue === '1' ? '': data.queue
//       var info = await dbSummInt.getMatches(name,0,data.size,queue,champion)
//       if (info[0].matches === null || info[0].matches.length < data.size){  
//         await mC.requestMatchList(summ,numericQueue,0,data.size)
//         info = await dbSummInt.getMatches(name,0,data.size,queue,champion)
//       }
//       return info
//     }
//     return await dbSummInt.getSummonerInfo(name,10,'')

//   }catch(e){
//     console.log('Error getting summoner page: ',e)
//   }
// }

// const summonerPage = async data => {
//   try{
//     let {name,queue,size,champion,matches} = data
//     const [summ] = await checkSummoner(name)
//     if (queue !== undefined){
//       queue = queue == 1 ? '': queue
//       const queryQueue = queue == 1 ? '': `AND m.queue_id = ${queue}`
//       const queryChampion = champion ? `AND cm.champion_id = ${champion}` : ''
//       let [info] = await dbSummInt.getMatches(name,0,size,queryQueue,queryChampion)
//       console.log(info)
//       if (info.matches === null || info.matches.length < size){
//         await mC.requestMatchList(summ,queue,0,data.size)
//         info = await dbSummInt.getMatches(name,0,data.size,queue,champion)
//       }
//       // return info

//       return info
//     }
//     // return await dbSummInt.getSummonerInfo(name,10,'')

//   }catch(e){
//     console.log('Error geting summoner page : ',e)
//   }
// }

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
    let {name,queue,size,champion,matchList} = data
    const [summ] = await checkSummoner(name)
    queue = queue == 1 ? '': queue
    const queryQueue = queue === '' ? queue: `AND m.queue_id = ${queue}`
    const queryChampion = champion ? `AND cm.champion_id = ${champion}` : ''
    console.log({name,size,queryQueue,queryChampion})
    let [info] = await dbSummInt.getMatches(name,0,size,queryQueue,queryChampion)
    const resMatches = info.matches ?? []

    if(resMatches.length < size ){
      await mC.requestMatchList(summ,queue,0,size)
      info = await dbSummInt.getMatches(name,0,size,queryQueue,queryChampion)
    }
    const filMatches = resMatches.filter(m => !matchList.includes(m.match_id))
    return ({matches:filMatches,status:200})
  }catch(e){
    console.log('Error getting summoner matches: ',e)
    return ({status:400,error:e})
    return 
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
    console.log('MatchList: ',matchList)
    const name = summoner.summoner_name
    console.log({name,query})
    const [profile] = await dbSummInt.getProfile(info.summonerName)
    const [matches] = await dbSummInt.getMatches(info.summonerName,0,10,query,'')
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