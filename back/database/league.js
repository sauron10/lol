const db = require('./index')

const addLeague = async league => {
  try{
    const res = await db.query(
      'INSERT INTO league VALUES($1,$2,$3)',
      [
        league.queueType,
        league.tier,
        league.leagueId
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
      'INSERT INTO summoner_league VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
      [
        leagueRel.summonerId,
        leagueRel.leagueId,
        leagueRel.leaguePoints,
        leagueRel.wins,
        leagueRel.losses,
        leagueRel.veteran,
        leagueRel.inactive,
        leagueRel.freshBlood,
        leagueRel.hotStreak,
        Date.now(),
        leagueRel.rank,
      ]
    )
    return res.rows
  }catch(e){
    console.log(e)
  }
}

module.exports = {
  addLeague,
  addLeagueRel,
}