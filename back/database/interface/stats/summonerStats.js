const db = require('../../index')

const summonerWinrateByPatch = async(summoner,queue) => {
  try{
    const res = await db.query(`
    select game_version,
    cast((count(*) filter (where ms.win=true)*1.0/count(*)*100.0) as decimal (5,2)) as wr
      from summoner s
      join match_summoner ms on s.id = ms.summoner_id
      join match m on m.id = ms.match_id 
        where lower(s.summoner_name) = lower($1) and m.queue_id = $2
        group by game_version   
        having count(*) > 10
    `,[summoner,queue])
    return res.rows
  }catch(e){
    console.log('Error getting the winrate of the summoner by patch: ',e)
    return []
  }
}


module.exports = {
  summonerWinrateByPatch
}