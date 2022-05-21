const connection = require('./connection')
const axios = require('axios').default
const dbSumm = require('../database/summoner')
const dbMatch = require('../database/match')
const dbIcon = require('../database/profileIcon')
const sC = require('./summoner_control')
const gH = require('./generalHelp')
const leagueControl = require('./leagueControl')


const checkMatch = async (query) => {
  try{
    const summ = await sC.checkSummoner(query.summoner)
    console.log(summ)
    if(!summ){
      return {'result' : 'Does not exist'}
    }
    // await gH.delay(1600)
    const match = await requestMatchList(summ[0],query.queue,query.start,query.count)
    return match
  }catch(e){
    console.log(e)
  }
}

const requestMatchList = async (summ,queue,start,count =10) => {
  try{
    var flag = true
    var response = []
    while(flag){
      response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summ.puuid}/ids?queue=${queue}&start=${start}&count=${count}`,connection.config)
      flag = await gH.waitLimit(response)
    }
    for (const match of response.data){
      // console.log(await dbMatch.getMatch(match))
      const matchInDb = await dbMatch.getMatch(match)
      if (matchInDb.length<1){
        await dbMatch.addMatch(match)
        await dbMatch.addMatchRel(match,summ)
        const data = await requestMatch(match)
        await addAllMatchSummoners(data)
        await updateMatch(data,summ)
      }
      console.log('Match in DB')      
    }
  }catch(e){
    console.log(e)
  }
}

const updateMatch = async (data,summ) => {
  try{
    await dbMatch.completeMatch(data)
    await dbMatch.completeMatchRel(data,summ)
    await formTeam(data)
    // await dbMatch.addBans(data)
    const [matchSummoner] = await dbMatch.getMatchSummoner(data.metadata.matchId,summ.id)
    await dbMatch.addChampionMatch(data,summ,matchSummoner.id)
    await dbMatch.addItemMatch(data,summ,matchSummoner.id)
    await dbMatch.addSummonerSpellRel(data,summ,matchSummoner.id)
    await dbMatch.addMatchMasteries(data,summ,matchSummoner.id)
    await dbMatch.addMatchChallenges(data,summ,matchSummoner.id)
  }catch(e){
    console.log(e)
  }
  
}

const formTeam = async match => {
  const teams = match.info.teams

  teams.map(async (team) => {
    const obj = team.objectives
    const bans = team.bans
    const t = {
      'matchId' : match.metadata.matchId,
      'firstBaron' : obj.baron.first,
      'baronKills' : obj.baron.kills,
      'firstChampion' : obj.champion.first,
      'championKills' : obj.champion.kills,
      'firstDragon' : obj.dragon.first,
      'dragonKills' : obj.dragon.kills,
      'firstInhibitor' : obj.inhibitor.first,
      'inhibitorKills' : obj.inhibitor.kills,
      'firstHerald' : obj.riftHerald.first,
      'heraldKills' : obj.riftHerald.kills,
      'firstTower' : obj.tower.first,
      'towerKills' : obj.tower.kills,
      'teamNumber' : team.teamId,
    }
    const res = await dbMatch.addTeam(t)
    // console.log("These is my team",team)
    // console.log("These are my bans",bans)
    bans.map(async (ban) => {
      // console.log("Adding Ban")
      const banDb = await dbMatch.addBans({
        'teamId' : res[0].id,
        'championId': ban.championId,
        'pickTurn' : ban.pickTurn
      })
    })
  })

}

const requestMatch = async match => {
  try{
    var flag = true
    var response =[]
    while(flag){
      response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${match}`,connection.config)
      flag = await gH.waitLimit(response)
    }
    data = response.data
    // console.log(data)
    return data
  }catch(e){
    console.log(e)
  }
}

const addAllMatchSummoners = async match => {
  try{
    const participants = match.info.participants

    for (const participant of participants){
      var summoner = await dbSumm.getSummonerDB(participant.summonerName)

      if(summoner.length === 0){
        summoner = {
          'id' : participant.summonerId,
          'name' : participant.summonerName,
          'puuid' : participant.puuid,
          'summonerLevel' : participant.summonerLevel,
          'profileIconId' : participant.profileIcon
        }
        await dbSumm.addSummonerDB(summoner)

        await dbIcon.addSummonerIcon(summoner)
        // await leagueControl.requestLeague(summoner.id)
      } else {
        summoner = summoner[0]
      }
      const matchSummoner = await dbMatch.getMatchSummoner(match.metadata.matchId,summoner.id)
      console.log("This is match summoner",matchSummoner)
      if (matchSummoner.length === 0){
        await dbMatch.addMatchRel(match.metadata.matchId,summoner)
        await updateMatch(match,summoner)
      }else {
        if(matchSummoner[0].kills === null){
          await updateMatch(match,summoner)
        }
      }
        
        
        
        // await requestMatchList(summoner)

    }

  }catch(e){
    console.log(e)
  }
}

const recursiveMatch = async match => {
  try{

  }catch(e){
    console.log('Recursive match ',e)
  }
}



module.exports = {
  checkMatch,
  requestMatchList,
}