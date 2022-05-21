const db = require('./index')

const addLeague = async league => {
  try{
    const res = await db.query(
      `INSERT INTO league VALUES($1,$2,$3)`,
      [
        league.leagueId,
        league.queueType,
        league.tier,
        
      ]
    )
    return res.rows
  }catch(e){
    console.log(e)
  }
}

const addLeagueRel  = async leagueRel => {
  try{
    const res = await db.query(
      'INSERT INTO summoner_league VALUES(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
      [ 
        leagueRel.summonerId,
        leagueRel.leagueId,
        leagueRel.tier,
        leagueRel.rank,
        leagueRel.leaguePoints,
        leagueRel.wins,
        leagueRel.losses,
        leagueRel.veteran,
        leagueRel.inactive,
        leagueRel.freshBlood,
        leagueRel.hotStreak,
        Date.now(),
        
      ]
    )
    return res.rows
  }catch(e){
    console.log(e)
  }
}

const getLeagueRel = async summonerId => {
  try{
    const res = await db.query(
      'SELECT * FROM summoner_league sl where sl.summoner_id = $1',
      [summonerId]
    )
    return res.rows
  }catch(e){
    console.log('Error getLeagueRel', e)
  }
}

const getLeague = async (summonerId,leagueId) => {
  try{
    
  }catch(e){
    console.log('Error at getLeague : ',e)
  }
}

module.exports = {
  addLeague,
  addLeagueRel,
  getLeagueRel,
}