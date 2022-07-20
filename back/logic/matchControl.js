const connection = require('./connection')
const axios = require('axios').default
const dbSumm = require('../database/summoner')
const dbMatch = require('../database/match')
const dbIcon = require('../database/profileIcon')
const sC = require('./summoner_control')
const gH = require('./generalHelp')
const leagueControl = require('./leagueControl')
const match = require('nodemon/lib/monitor/match')


const checkMatch = async (query) => {
  try {
    const summ = await sC.checkSummoner(query.summoner)
    console.log(summ)
    if (!summ) {
      return { 'result': 'Does not exist' }
    }
    // await gH.delay(1600)
    const match = await requestMatchList(summ[0], query.queue, query.start, query.count)
    return match
  } catch (e) {
    console.log(e)
  }
}

const requestMatchList = async (summ, queue, start, count = 10) => {
  try {
    let flag = true
    let response = []
    while (flag) {
      await gH.timer()
      response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summ.puuid}/ids?${queue ? `queue=${queue}`:''}&start=${start}&count=${count}`, connection.config)
      flag = await gH.waitLimit(response)
    }
    return await saveMatches(response.data, summ)

  } catch (e) {
    console.log(e)
  }
}

const saveMatches = async (matchList, summoner) => {
  try {
    const promiseArray = matchList.map(async match => {
      const matchInDb = await dbMatch.getMatch(match)
      if (matchInDb.length < 1) {
        await dbMatch.addMatch(match)
        await dbMatch.addMatchRel(match, summoner)
        const data = await requestMatch(match)
        await addAllMatchSummoners(data)
        await updateMatch(data, summoner)
        console.log(`Saved match : ${match}`)
      }
      console.log('Match in DB')
      return {'status' : 'ok'}
    })

    const addedMacthes = await Promise.all(promiseArray)

    // for (const match of matchList) {
    //   // console.log(await dbMatch.getMatch(match))
    // }
    return { 'status': 'ok' }
  } catch (e) {
    console.log('Error in save matches: ', e)
  }
}

const saveMatchesList = async(matchList,summoner,n) => {
  
  const forSplitN = (arr,n) => {
    let chunked = []
    for (let i=0; i<arr.length; i+=n){
      chunked = [...chunked,arr.slice(i,i+n)]
    }
    console.log({chunked})
    return chunked
  }

  const chunks = forSplitN(matchList,n)
  for (let chunk of chunks){
    await saveMatches(chunk,summoner)
  }
  return {'status' : 'ok'}

}

const getSeasonMatches = async (summoner, startTime) => {
  try {
    let flag = true
    let response = []
    let matchList = []
    let start = 0
    while (true) {
      while (flag) {
        await gH.timer()
        response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?startTime=${startTime}&start=${start}&count=100`, connection.config)
        flag = await gH.waitLimit(response)
      }
      matchList = [...matchList, ...(response.data)]
      flag = true
      start += 100
      console.log('This is the size: ', matchList.length)
      if (response.data.length < 100) break
    }
    return matchList
  } catch (e) {
    console.log('Error getting season Matches MC: ', e)
  }
}

const updateMatch = async (data, summ) => {
  try {
    await dbMatch.completeMatch(data)
    await dbMatch.completeMatchRel(data, summ)
    await formTeam(data)
    const [matchSummoner] = await dbMatch.getMatchSummoner(data.metadata.matchId, summ.id)
    await dbMatch.addChampionMatch(data, summ, matchSummoner.id)
    await dbMatch.addItemMatch(data, summ, matchSummoner.id)
    await dbMatch.addSummonerSpellRel(data, summ, matchSummoner.id)
    await dbMatch.addMatchMasteries(data, summ, matchSummoner.id)
    if (data.info.participants[0].challenges) {
      await dbMatch.addMatchChallenges(data, summ, matchSummoner.id)
    }
  } catch (e) {
    console.log(e)
  }

}

const formTeam = async match => {
  try {
    const teams = match.info.teams
    teams.map(async (team) => {
      try {
        const obj = team.objectives
        const bans = team.bans
        const t = {
          'matchId': match.metadata.matchId,
          'firstBaron': obj.baron.first,
          'baronKills': obj.baron.kills,
          'firstChampion': obj.champion.first,
          'championKills': obj.champion.kills,
          'firstDragon': obj.dragon.first,
          'dragonKills': obj.dragon.kills,
          'firstInhibitor': obj.inhibitor.first,
          'inhibitorKills': obj.inhibitor.kills,
          'firstHerald': obj.riftHerald.first,
          'heraldKills': obj.riftHerald.kills,
          'firstTower': obj.tower.first,
          'towerKills': obj.tower.kills,
          'teamNumber': team.teamId,
        }
        const res = await dbMatch.addTeam(t)
        // console.log(res)
        if (res.length > 0) {
          if (bans !== null || bans.length > 0) {
            try {
              bans.map(async (ban) => {
                // console.log("Adding Ban")
                if (ban.championId > 0) {
                  const banDb = await dbMatch.addBans({
                    'teamId': res[0].id,
                    'championId': ban.championId,
                    'pickTurn': ban.pickTurn
                  })
                }
              })
            } catch (e) {
              console.log('Error in formTeam: ', e)
            }
          }
        }
      } catch (e) {
        console.log('Eror in form team: ', e)
      }
    })
  } catch (e) {
    console.log("Error adding team", e)
  }

}

const requestMatch = async match => {
  try {
    var flag = true
    var response = []
    while (flag) {
      await gH.timer()
      response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${match}`, connection.config)
      flag = await gH.waitLimit(response)
    }
    data = response.data
    // console.log(data)
    return data
  } catch (e) {
    console.log(e)
  }
}

const addAllMatchSummoners = async match => {
  try {
    const participants = match.info.participants

    for (const participant of participants) {
      var summoner = await dbSumm.getSummonerDB(participant.summonerName)

      if (summoner.length === 0) {
        summoner = {
          'id': participant.summonerId,
          'name': participant.summonerName,
          'puuid': participant.puuid,
          'summonerLevel': participant.summonerLevel,
          'profileIconId': participant.profileIcon
        }
        await dbSumm.addSummonerDB(summoner)

        await dbIcon.addSummonerIcon(summoner)
        // await leagueControl.requestLeague(summoner.id)
      } else {
        summoner = summoner[0]
      }
      const matchSummoner = await dbMatch.getMatchSummoner(match.metadata.matchId, summoner.id)
      if (matchSummoner.length === 0) {
        await dbMatch.addMatchRel(match.metadata.matchId, summoner)
        await updateMatch(match, summoner)
      } else {
        if (matchSummoner[0].kills === null) {
          await updateMatch(match, summoner)
        }
      }



      // await requestMatchList(summoner)

    }

  } catch (e) {
    console.log(e)
  }
}

const recursiveMatch = async match => {
  try {

  } catch (e) {
    console.log('Recursive match ', e)
  }
}



module.exports = {
  checkMatch,
  requestMatchList,
  getSeasonMatches,
  saveMatches,
  saveMatchesList
}