const db = require('../index')
const sqlTools = require('../sql_helper')

// const getSummonerInfo = async (summonerName, numberOfMatches, queue) => {
//   console.log(summonerName)
//   const numberFlag = Number.isInteger(numberOfMatches)

//   const number = numberFlag ? numberOfMatches : 10

//   const summoners = sqlTools.nestQuery(`
//   SELECT *
//   FROM summoner_spells_ms ssm
//   JOIN summoner_spells sp on sp.id = ssm.summoner_spell_id
//   WHERE ms.id = ssm.match_summoner_id  
//   `)

//   const runes = sqlTools.nestQuery(`
//   SELECT *
//   FROM match_summoner_runes msr
//   JOIN runes r on r.id = msr.rune_id
//   WHERE msr.match_summoner_id = ms.id  
//   `)

//   const items = sqlTools.nestQuery(`
//   SELECT *
//   FROM match_summoner_items msi
//   JOIN items i on i.id = msi.item_id
//   WHERE msi.match_summoner_id = ms.id  
//   `)

//   const players = sqlTools.nestQuery(`
//   SELECT *,
//   ${summoners} as summoners,
//   ${runes} as runes,
//   ${items} as items
//   FROM match_summoner ms
//   JOIN champion_ms cm ON ms.id = cm.match_summoner_id
//   JOIN champion c ON c.id = cm.champion_id
//   WHERE m.id = ms.match_id
//   ORDER BY team, participant
//   `)

//   const bans = sqlTools.nestQuery(`
//   SELECT name,image
//   FROM bans ba
//   JOIN champion ON ba.champion_id = champion.id
//   WHERE ba.team_id = te.id
//   `)

//   const teams = sqlTools.nestQuery(`
//   SELECT *,
//   ${bans} as bans
//   FROM team te
//   WHERE te.match_id = m.id 
//   ORDER BY te.team_number 
//   `)

//   const matches = sqlTools.nestQuery(`
//   SELECT *,
//   ${summoners} as summoner_spells,
//   ${runes} as runes,
//   ${items} as items,
//   ${players} as players,
//   ${teams} as teams
//   FROM match m 
//   JOIN match_summoner ms ON m.id = ms.match_id
//   JOIN champion_ms cm ON ms.id = cm.match_summoner_id
//   JOIN champion c ON c.id = cm.champion_id
//   WHERE ms.summoner_id = s.id ${queue}
//   ORDER BY game_creation DESC
//   FETCH FIRST ${number} ROWS ONLY
//   `)

//   const leagues = sqlTools.nestQuery(`
//   SELECT sl.tier,rank,league_points,wins,losses,date,queue_type
//   FROM summoner_league sl
//   JOIN league l on l.id = sl.league_id
//   WHERE sl.summoner_id = s.id
//   ORDER BY sl.date   
//   `)

//   const response = await db.query(`
//   SELECT summoner_name,summoner_level,image as icon, 
//   ${leagues} as leagues,
//   ${matches} as matches
//   FROM summoner s
//   JOIN profile_icon_summoner pis on pis.summoner_id = s.id
//   JOIN profile_icon pi on pi.id = pis.profile_icon_id
//   WHERE lower(s.summoner_name) = lower($1)
  
//   `, [
//     summonerName,
//   ])
//   return {
//     'rows': response.rows.length,
//     'data': response.rows
//   }
// }

const getMatches = async (summonerName, queue,champion,start,number,matchList) => {
  const isQueue = queue ? true:false
  const isChampion = champion ? true:false 

  // console.log({summonerName, queue,champion,start,number,matchList})

  const summoners = sqlTools.nestQuery(`
  SELECT name,image,sp.id
  FROM summoner_spells_ms ssm
  JOIN summoner_spells sp on sp.id = ssm.summoner_spell_id
  WHERE ms.id = ssm.match_summoner_id  
  `)

  const runes = sqlTools.nestQuery(`
  SELECT name,image,r.id
  FROM match_summoner_runes msr
  JOIN runes r on r.id = msr.rune_id
  WHERE msr.match_summoner_id = ms.id  
  `)

  const items = sqlTools.nestQuery(`
  SELECT item_name,image,i.id
  FROM match_summoner_items msi
  JOIN items i on i.id = msi.item_id
  WHERE msi.match_summoner_id = ms.id  
  `)

  const players = sqlTools.nestQuery(`
  SELECT kills,deaths,assists,minions_killed,
  gold_earned,total_damage_dealt_champs,
  current_summoner_name,team,c.name,c.image,participant,win,
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
  SELECT kills,deaths,assists,minions_killed,
  gold_earned,total_damage_dealt_champs,
  current_summoner_name,team,name,image,game_creation,
  game_duration,game_mode,game_type,game_version,platform,
  queue_id,match_id,win,
  ${summoners} as summoner_spells,
  ${runes} as runes,
  ${items} as items,
  ${players} as players,
  ${teams} as teams
  FROM match m 
  JOIN match_summoner ms ON m.id = ms.match_id
  JOIN champion_ms cm ON ms.id = cm.match_summoner_id
  JOIN champion c ON c.id = cm.champion_id
  WHERE ms.summoner_id = s.id 
  ${queue !== null ? `and m.queue_id = $4`:''}
  ${champion !== null ? `and cm.champion_id = $5` : ''}
        ${matchList !== null ? `and ms.match_id not in ${matchList}` : ''}
  ORDER BY game_creation DESC
  LIMIT $2 OFFSET $3
  `)

  const response = await db.query(`
  SELECT 
  ${matches} as matches
  FROM summoner s
  WHERE lower(s.summoner_name) = lower($1)
  `,[summonerName,number,start,queue,champion].filter(item => item !== null)
  )

  const [miau] = response.rows
  console.log(miau.matches.map(ele => ele.match_id))
  return response.rows

}

const getProfile = async (summonerName) => {
  try {
    const icons = sqlTools.nestQuery(`
      SELECT image
      FROM profile_icon pi2
      JOIN profile_icon_summoner pis on pis.profile_icon_id = pi2.id 
      WHERE pis.summoner_id = s.id   
    `)


    const solo = sqlTools.nestQuery(`
      SELECT sl.tier,rank,league_points,wins,losses,date,queue_type
      FROM summoner_league sl
      JOIN league l on l.id = sl.league_id
      WHERE sl.summoner_id = s.id and queue_type like '%SOLO%'
      ORDER BY sl.date desc 
    `)

    const flex = sqlTools.nestQuery(`
      SELECT sl.tier,rank,league_points,wins,losses,date,queue_type
      FROM summoner_league sl
      JOIN league l on l.id = sl.league_id
      WHERE sl.summoner_id = s.id and queue_type like '%FLEX%'
      ORDER BY sl.date desc
    `)

    const leagues = sqlTools.nestQuery(`
      SELECT 
      ${solo} as solo,
      ${flex} as flex
    `)    

    const response = await db.query(`
      SELECT summoner_name,summoner_level,
      ${icons} as icons ,
      ${leagues} as leagues
      FROM summoner s
      WHERE lower(s.summoner_name) = lower($1)
      `, [summonerName])

    return response.rows
  } catch (e) {
    console.log('Error getting profile from DB: ', e)
  }


}

const wastedTime = async(summonerName) => {
  const response = await db.query(`
  select 
      sum(game_duration) as wasted_time
      from match_summoner ms
      join match m on m.id = ms.match_id
      join summoner s on ms.summoner_id = s.id 
      where lower(s.summoner_name) = lower($1) and game_duration < 7200
  
  `,[summonerName])
  return response.rows
}



module.exports = {
  // getSummonerInfo,
  getMatches,
  getProfile,
  wastedTime
}