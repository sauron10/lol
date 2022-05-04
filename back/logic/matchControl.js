const connection = require('./connection')
const axios = require('axios').default
const dbSumm = require('../database/summoner')
const dbMatch = require('../database/match')
const dbIcon = require('../database/profileIcon')
const sC = require('./summoner_control')
const gH = require('./generalHelp')
const leagueControl = require('./leagueControl')


const checkMatch = async summonerName => {
  try{
    const summ = await sC.checkSummoner(summonerName)
    if(!summ){
      return {'result' : 'Does not exist'}
    }
    await gH.delay(1600)
    const match = await requestMatchList(...summ)
    return match
  }catch(e){
    console.log(e)
  }
}

const requestMatchList = async summ => {
  try{
    const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summ.puuid}/ids?type=ranked&start=0&count=100`,connection.config)
    await gH.delay(1600)
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
    const matchSummoner = await dbMatch.getMatchSummoner(data.metadata.matchId,summ.id)
    await dbMatch.addChampionMatch(data,summ,matchSummoner.id)
    await dbMatch.addItemMatch(data,summ,matchSummoner.id)
    await dbMatch.addSummonerSpellRel(data,summ,matchSummoner.id)
    await dbMatch.addMatchMasteries(data,summ,matchSummoner.id)
    await dbMatch.addMatchChallenges(data,summ,matchSummoner.id)
  }catch(e){
    console.log(e)
  }
  
}

const requestMatch = async match => {
  try{
    const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${match}`,connection.config)
    data = response.data
    await gH.delay(1600)
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
      if (!matchSummoner){
        await dbMatch.addMatchRel(match.metadata.matchId,summoner)
        await updateMatch(match,summoner)
        await requestMatchList(summoner)
      }
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
}