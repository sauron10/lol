
// Not for Use
const db = require('./index')

const dbNames = {
  leagueId  : 'league_id',
  tier      : 'tier',
  rank      : 'rank',
  summonerId: 'summoner_id',
  summonerName : 'summoner_name',
  leaguePoints : 'league_points',
  wins       : 'wins',
  losses     : 'losses',
  veteran    : 'veteran',
  inactive   : 'inactive',
  freshBlood : 'fresh_blood',
  hotStreak  : 'hot_streak',
  queueType  : 'queue_type',
  puuid      : 'puuid',
}


const getAllSummoners = async(fields,filter) => {
  try{
    const res = await db.query('SELECT summoner_id FROM summoner ',[])
    return res.rows
  }catch(error){
    console.log(error)
  }  
}

const getSummonerDB = async summName => {
  try{
    const res = await db.query('SELECT * FROM summoner WHERE summoner_name = $1',[summName])
    return res.rows    
  }catch(error){
    console.error(error)
  }
}

const saveSummonerName = async r => {
  const res = await db.query(`INSERT INTO summoner (summoner_id,summoner_name,puuid,profile_icon_id,summoner_level) VALUES ($1,$2,$3,$4,$5) RETURNING *`,[r.id,r.name,r.puuid,r.profileIconId,r.summonerLevel])
  // console.log("DB resp",res.rows)
  return res.rows
}

const updateSummonerName = async r => {
  const res = await db.query(`UPDATE summoner SET summoner_name = $1,puuid = $2,profile_icon_id = $3,summoner_level = $4 WHERE summoner_id = $5 RETURNING *`,[r.name,r.puuid,r.profileIconId,r.summonerLevel,r.id])
  console.log(res.rows)
  return res.rows
}


const saveSummoner = async (r) => {
  try{
    const query = {
      text : 'INSERT INTO summoner VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
      values : [
        r.leagueId,
        r.tier,
        r.rank,
        r.summonerId,
        r.summonerName,
        r.leaguePoints,
        r.wins,
        r.losses,
        r.veteran,
        r.inactive,
        r.freshBlood,
        r.hotStreak,
        r.queueType,
      ]
    } 
    // console.log(query)
    const res = await db.query(query)
    // console.log(res.rows0])
  }catch(error){
    console.log(error)
  }
}


const updateSummoner = async (summId,puuid) => {
  try{
    const query = {
      text : 'UPDATE summoner SET puuid = $1 WHERE summoner_id = $2 RETURNING *',
      values : [
        puuid,
        summId,
      ]
    }

    const res = await db.query(query)
    return res.rows[0]

  }catch(error){
    console.error(error)
  }
}

module.exports = {getAllSummoners,
                  saveSummoner,
                  updateSummoner,
                  getSummonerDB,
                  saveSummonerName,
                  updateSummonerName,
                }