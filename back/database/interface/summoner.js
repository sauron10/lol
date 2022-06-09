const db = require('../index')
const sqlTools = require('../sql_helper')

const getSummonerInfo = async (summonerName, numberOfMatches,queue) => {
  console.log(summonerName)
  const numberFlag = Number.isInteger(numberOfMatches)

  const number = numberFlag ? numberOfMatches : 10

  const summoners = sqlTools.nestQuery(`
  SELECT *
  FROM summoner_spells_ms ssm
  JOIN summoner_spells sp on sp.id = ssm.summoner_spell_id
  WHERE ms.id = ssm.match_summoner_id  
  `)

  const runes = sqlTools.nestQuery(`
  SELECT *
  FROM match_summoner_runes msr
  JOIN runes r on r.id = msr.rune_id
  WHERE msr.match_summoner_id = ms.id  
  `)

  const items = sqlTools.nestQuery(`
  SELECT *
  FROM match_summoner_items msi
  JOIN items i on i.id = msi.item_id
  WHERE msi.match_summoner_id = ms.id  
  `)

  const players = sqlTools.nestQuery(`
  SELECT *,
  ${summoners} as summoners,
  ${runes} as runes,
  ${items} as items
  FROM match_summoner ms
  JOIN champion_ms cm ON ms.id = cm.match_summoner_id
  JOIN champion c ON c.id = cm.champion_id
  WHERE m.id = ms.match_id
  ORDER BY team, participant
  `)

  const bans = sqlTools.nestQuery(`
  SELECT name,image
  FROM bans ba
  JOIN champion ON ba.champion_id = champion.id
  WHERE ba.team_id = te.id
  `)

  const teams = sqlTools.nestQuery(`
  SELECT *,
  ${bans} as bans
  FROM team te
  WHERE te.match_id = m.id 
  ORDER BY te.team_number 
  `)

  const matches = sqlTools.nestQuery(`
  SELECT *,
  ${summoners} as summoner_spells,
  ${runes} as runes,
  ${items} as items,
  ${players} as players,
  ${teams} as teams
  FROM match m 
  JOIN match_summoner ms ON m.id = ms.match_id
  JOIN champion_ms cm ON ms.id = cm.match_summoner_id
  JOIN champion c ON c.id = cm.champion_id
  WHERE ms.summoner_id = s.id ${queue}
  ORDER BY game_creation DESC
  FETCH FIRST ${number} ROWS ONLY
  `)

  const leagues = sqlTools.nestQuery(`
  SELECT sl.tier,rank,league_points,wins,losses,date,queue_type
  FROM summoner_league sl
  JOIN league l on l.id = sl.league_id
  WHERE sl.summoner_id = s.id
  ORDER BY sl.date   
  `)

  const response = await db.query(`
  SELECT summoner_name,summoner_level,image as icon, 
  ${leagues} as leagues,
  ${matches} as matches
  FROM summoner s
  JOIN profile_icon_summoner pis on pis.summoner_id = s.id
  JOIN profile_icon pi on pi.id = pis.profile_icon_id
  WHERE lower(s.summoner_name) = lower($1)
  
  `,[
    summonerName,
  ])
  return {
    'rows' : response.rows.length,
    'data' : response.rows
  }
}

const getMatches = async (summonerName,start,number,queue='',champion) => {
  const summoners = sqlTools.nestQuery(`
  SELECT *
  FROM summoner_spells_ms ssm
  JOIN summoner_spells sp on sp.id = ssm.summoner_spell_id
  WHERE ms.id = ssm.match_summoner_id  
  `)

  const runes = sqlTools.nestQuery(`
  SELECT *
  FROM match_summoner_runes msr
  JOIN runes r on r.id = msr.rune_id
  WHERE msr.match_summoner_id = ms.id  
  `)

  const items = sqlTools.nestQuery(`
  SELECT *
  FROM match_summoner_items msi
  JOIN items i on i.id = msi.item_id
  WHERE msi.match_summoner_id = ms.id  
  `)

  const players = sqlTools.nestQuery(`
  SELECT *,
  ${summoners} as summoners,
  ${runes} as runes,
  ${items} as items
  FROM match_summoner ms
  JOIN champion_ms cm ON ms.id = cm.match_summoner_id
  JOIN champion c ON c.id = cm.champion_id
  WHERE m.id = ms.match_id
  ORDER BY team, participant
  `)

  const bans = sqlTools.nestQuery(`
  SELECT name,image
  FROM bans ba
  JOIN champion ON ba.champion_id = champion.id
  WHERE ba.team_id = te.id
  `)

  const teams = sqlTools.nestQuery(`
  SELECT *,
  ${bans} as bans
  FROM team te
  WHERE te.match_id = m.id
  ORDER BY te.team_number   
  `)

  const matches = sqlTools.nestQuery(`
  SELECT *,
  ${summoners} as summoner_spells,
  ${runes} as runes,
  ${items} as items,
  ${players} as players,
  ${teams} as teams
  FROM match m 
  JOIN match_summoner ms ON m.id = ms.match_id
  JOIN champion_ms cm ON ms.id = cm.match_summoner_id
  JOIN champion c ON c.id = cm.champion_id
  WHERE ms.summoner_id = s.id ${queue} ${champion}
  ORDER BY game_creation DESC
  LIMIT ${number} OFFSET ${start}
  `)

  const response = await db.query(`
  SELECT 
  ${matches} as matches
  FROM summoner s
  WHERE lower(s.summoner_name) = lower($1)
  `,[summonerName])

  return response.rows

}

module.exports = {
  getSummonerInfo,
  getMatches,
}