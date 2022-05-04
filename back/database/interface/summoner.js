const db = require('../index')
const sqlTools = require('../sql_helper')

const getSummonerInfo = async (summonerName, numberOfMatches) => {

  const numberFlag = Number.isInteger(numberOfMatches)

  const number = numberFlag ? numberOfMatches : 10

  const players = sqlTools.nestQuery(`
  SELECT current_summoner_name as participant
  FROM match_summoner ms
  WHERE m.id = ms.match_id
  `)

  const matches = sqlTools.nestQuery(`
  SELECT match_id,
         current_summoner_name as player,
         assists,
         deaths,
         kills,
  ${players} as players
  FROM match m 
  JOIN match_summoner ms ON m.id = ms.match_id
  WHERE ms.summoner_id = s.id
  FETCH FIRST ${number} ROWS ONLY
  `)

  const response = await db.query(`
  SELECT summoner_name,summoner_level,
  ${matches} as matches
  FROM summoner s
  WHERE s.summoner_name SIMILAR TO $1
  
  `,[
    summonerName,
  ])

  return {
    'rows' : response.rows.length,
    'data' : response.rows
  }
}

module.exports = {
  getSummonerInfo,
}