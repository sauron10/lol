const db = require('../../index')

const summonerWinrateByPatch = async(summoner,queue) => {
  try{
    const res = await db.query(`
    select game_version,
    count(*) as matches,
    count(*) filter(where ms.win = true) as wins,
    (count(*) filter(where ms.win = true)*100/count(*)) as wr
      from summoner s
      join match_summoner ms on s.id = ms.summoner_id
      join match m on m.id = ms.match_id 
        where lower(s.summoner_name) = lower($1) and m.queue_id = $2
        group by game_version   
        having count(*) > 10 
        order by game_version desc   
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