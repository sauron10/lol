const db = require('../index')

const playedWith = async (name,queue) => {
  try {
    const res = await db.query(`
    select current_summoner_name ,count (*),
    count(*) filter (where ms.win = true) as wins,
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
    from match_summoner ms
    join "match" m on ms.match_id = m.id
    where m.id in (select m.id
                  from match m
                  join match_summoner ms on m.id = ms.match_id
                  where lower(ms.current_summoner_name) = lower($1)) ${queue}
    group by current_summoner_name
    order by count desc
    limit 10 offset 1
    `, [
      name
    ])
    return res.rows
  } catch (e) {
    console.log('Error searching for playedWith: ',e)
  }
}

module.exports = {
  playedWith
}