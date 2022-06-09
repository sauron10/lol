const db = require('../index')
const sqlTools = require('../sql_helper')

const getBestChamps = async (summoner,queueId) => {
  try{
    const res = await db.query(`
      SELECT c.id,c.name,c.image,COUNT(*) as games,
      count(*) filter (where ms.win=true) as wins,
      count(*) filter (where ms.win=false) as losses,
      count(*) filter (where ms.first_blood_kill=true or ms.first_blood_assist=true) as first_bloods,
      count(*) filter (where ms.first_tower_kill=true or ms.first_tower_assist=true) as first_turret,
      cast(AVG(kills) as decimal(3,1)) as kills,
      cast(avg(deaths) as decimal(3,1)) as deaths,
      cast(avg(assists) as decimal(3,1)) as assists,
      cast(avg(gold_earned) as decimal(7,1)) as gold,
      cast(avg(minions_killed) as decimal(4,1)) as minions,
      cast(avg(wards_placed) as decimal(4,1)) as wards,
      cast(avg(turret_kills) as decimal(4,1)) as turrets,
      cast(avg(total_damage_dealt_champs) as decimal(7,1)) as damage,
      cast(avg(damage_to_buildings) as decimal(7,1)) as dmg_buildings,
      cast(avg(game_duration) as decimal(8,1)) as duration
        FROM champion c
        JOIN champion_ms cms ON c.id = cms.champion_id
        JOIN match_summoner ms ON cms.match_summoner_id = ms.id
        join match m on m.id = ms.match_id
        WHERE ms.summoner_id = $1 and m.queue_id= $2
        GROUP BY c.name, c.image, c.id
        ORDER BY games DESC
    `,[summoner.id,queueId])
    return res.rows
  }catch(e){
    console.log('Error getting best champs: ',e)
  }
}

module.exports = {
  getBestChamps,
}