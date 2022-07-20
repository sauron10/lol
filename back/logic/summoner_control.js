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


/**
 * Makes all the process of searching and adding summoners
 *  Checks if a summoner is already in the database
 *  If not makes a request to the API and adds them to the databse
 *    Including icons and leagues
 *  Makes the query again to recieve the information in the standard way
 * @param {String} summName The name of the summoner
 * @returns {Object} An object with data about the summoner
 */

const checkSummoner = async summName => {
  try {
    var res = await dbSumm.getSummonerDB(summName)
    if (res.length < 1) {
      console.log("Requesting Summoner")
      const resAPI = await requestSummoner(summName)
      const resAddSumm = await dbSumm.addSummonerDB(resAPI)
      const resAddProIcon = await dbIcon.addSummonerIcon(resAPI)
      res = await dbSumm.getSummonerDB(summName)
      console.log(res)
      await leagueControl.requestLeague(res[0].id)
    } else {
      console.log("Summoner in DB")
      await leagueControl.checkLeague(res[0].id)
    }
    return res
  } catch (e) {
    console.log(e)
    return 'The summoner was not found'
  }
}

/**
 * Makes request to riots api with info about the summoner
 * @param {String} summName Name of the summoner
 * @returns {Object} An object with data about the summoner
 */
const requestSummoner = async summName => {
  try {
    const encSummName = encodeURI(summName)
    let flag = true
    let response = []
    while (flag) {
      await gH.timer()
      response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encSummName}`, connection.config)
      flag = await gH.waitLimit(response)
    }
    return response.data
  } catch (e) {
    console.log(e)
  }
}

/**
 * Get the summoner profile
 * @param {Object} data
 *  @property {String} name The name of the summoner
 * @returns {Object} An object with profile data
 */

const summonerProfile = async data => {
  try {
    let { name } = data
    let [profile] = await dbSummInt.getProfile(name)
    if (!profile) {
      console.log('Geting profile')
      await checkSummoner(name)
      const [retry] = await dbSummInt.getProfile(name)
      profile = retry
    }
    return ({ profile, status: 200 })

  } catch (e) {
    console.log('Error getting summoner profile: ', e)
    return ({ error: e, status: 400 })
  }
}

/**
 * Gets an array of match objects according to certain filters
 * @param {Object} data 
 *  @property {String} name The name of the summoner
 *  @property {Number} queue The id of the queue
 *  @property {Number} size The number of rows to be returned
 *  @property {Number} champion The id of the champion
 *  @property {Array} matchList An array of the matches already in the front client
 * @returns {Array} An array of match objects
 */
const summonerMatches = async data => {
  try {
    const sqlMatchList = (matchList) => {
      if (!matchList.length > 0) return null
      const joined = matchList.join("','")
      return `('${joined}')`
    }
    let { name, queue, size, champion, matchList } = data
    const [summ] = await checkSummoner(name)
    queue = queue == 1 ? null : `${queue}`
    champion = champion === '' ? null : `${champion}`
    let [info] = await dbSummInt.getMatches(name, queue, champion, 0, size, sqlMatchList(matchList))
    const resMatches = info.matches ?? []
    if (resMatches.length < size) {
      await mC.requestMatchList(summ, queue, 0, size)
      info = await dbSummInt.getMatches(name, queue, champion, 0, size, sqlMatchList(matchList))
    }
    return ({ matches: resMatches, status: 200 })
  } catch (e) {
    console.log('Error getting summoner matches: ', e)
    return ({ status: 400, error: e })
    return
  }
}


/**
 * Forces profile and matches to update the information in the database
 * @param {Object} info An object with information for the query
 *  @property {Number} queue Id of the queue from info
 *  @param {Object} summoner Database representation of a summoner 
 * @returns {Object} Returns an object with the profile and the matches of the summoner
 */
const updateSummoner = async (info) => {
  try {
    queue = info.queue == 1 ? null : `${info.queue}`
    const [summoner] = await checkSummoner(info.summonerName)
    const league = await leagueControl.requestLeague(summoner.id)
    const name = summoner.summoner_name
    const [profile] = await dbSummInt.getProfile(name)
    console.log({ name, queue })
    const [matches] = await dbSummInt.getMatches(name, queue, null, 0, 20, null)
    const resMatches = matches.matches ?? []
    return ({ ...profile, matches: resMatches })
  } catch (e) {
    console.log('Error updating the summoner', e)
  }
}

/**
 * Starts the search for all the matches in the season for a summoner
 * @param {Object} info Information about summoner
 *  @property {String} summonerName Name of the summoner
 *  @property {Number} startTime The limit on which the request will be made (here is the start of the season)
 * @returns {Object} Returns a list of the matches saved 
 */
const getSummonerSeason = async info => {
  try {
    const [summoner] = await checkSummoner(info.summonerName)
    const matchList = await mC.getSeasonMatches(summoner, info.startTime)
    const savedMatches = await mC.saveMatchesList(matchList, summoner, 10)
    return { ...savedMatches, 'list': matchList }

  } catch (e) {
    console.log('Error in get summoner season :', e)
  }
}

/**
 * Gets the champions that have been played by a summoner
 * @param {Object} info
 *  @property {String} summonerName Name of the summoner
 *  @property {Number} queue Queue id for the query 
 * @returns {Array} Returns an array with all the champions used by the summoner 
 */
const getSummonerBestChamps = async info => {
  try {
    const [summoner] = await checkSummoner(info.summonerName)
    const champList = await intChamps.getBestChamps(summoner, info.queue)
    return champList
  } catch (e) {
    console.log('Error in getSumonerBestChamps')
  }
}

/**
 * @todo Shuld remove the interpolation to the database and instead parametrize
 * Gets the summoners athat play the most with a player
 * @param {Object} info 
 *  @property {String} summonerName Name of the summoner
 *  @property {Number} queue ID of the queue of the matches 
 * @returns {Array} Returns a list with the most played with summoners
 */
const getPlayedWith = async info => {
  try {
    const { summonerName, queue } = info
    const queueAnd = queue != 1 ? `and m.queue_id = ${queue}` : ''
    const summonersPlayedWith = await intPlayed.playedWith(summonerName, queueAnd)
    return summonersPlayedWith
  } catch (e) {
    console.log('Error getting played with :', e)
  }
}



module.exports = {
  checkSummoner,
  requestSummoner,
  summonerProfile,
  summonerMatches,
  updateSummoner,
  getSummonerSeason,
  getSummonerBestChamps,
  getPlayedWith,
}