const db = require('../../index')

const itemByWinrate = async (queue, version) => {
  try {
    const res = await db.query(`
    select i.item_name,
    count(*) as uses,
    count(*) filter(where ms.win = true) as wins,
    (count(*) filter(where ms.win = true)*100/count(*)) as wr
      from items i 
      join match_summoner_items msi on msi.item_id = i.id
      join match_summoner ms on msi.match_summoner_id  = ms.id
      join match m on ms.match_id = m.id
        where m.queue_id = $1 and m.game_version like $2
        group by i.item_name
        having count(*) > 40
        order by wr desc
    `, [queue, version])
    return res.rows
  } catch (e) {
    console.log('Error getting items by winrate: ', e)
    return []
  }

}


const commonItemsBySummonerChampion = async (summoner, champion, queue, version) => {
  try {
    const res = await db.query(`
    select i.item_name,
    count(*) as uses,
    count(*) filter(where ms.win = true) as wins,
    (count(*) filter(where ms.win = true)*100/count(*)) as winrate
      from items i 
      join match_summoner_items msi on msi.item_id = i.id
      join match_summoner ms on msi.match_summoner_id  = ms.id
      join summoner s on ms.summoner_id = s.id
      join champion_ms cm on cm.match_summoner_id = ms.id 
      join champion c on c.id = cm.champion_id
      join match m on m.id = ms.match_id 
        where i.id in (select i.id
          from items i
          left join item_part ip on i.id = ip.item_id 
            where ip.item_id is null and i.required_ally is null
              union
                select ip.item_id
                  from items i 
                  join item_part ip on i.id = ip.item_id
                    where ip.part_of_item_id in (select i.id
                      from items i
                        where i.required_ally is not null)) 
                        and lower(s.summoner_name) = lower($1) and lower(c.name) = lower($2) and m.queue_id = $3 and m.game_version = $4
                        group by i.item_name
                        having count(*) > 10
                        order by uses desc
    `, [summoner, champion, queue, version])
    return res.rows
  } catch (e) {
    console.log('Error getting items by summoner-champion: ', e)
    return []
  }
}

const commonItemsByChampion = async (champion, queue, version) => {
  try {
    const res = await db.query(`
    select item_name,count(*) as uses,i.image,
    cast((count(*) filter (where ms.win = true) * 100.0 / count(*)) as decimal(5,2)) as winrate
      from items i 
      join match_summoner_items msi on i.id = msi.item_id 
      join match_summoner ms on ms.id = msi.match_summoner_id
      join champion_ms cm on cm.match_summoner_id = ms.id
      join champion c on c.id = cm.champion_id
      join match m on m.id = ms.match_id 
        where lower(c."name") = lower($1) and i.id in (select i.id
          from items i
          left join item_part ip on i.id = ip.item_id 
            where ip.item_id is null and i.required_ally is null
              union
                select ip.item_id
                  from items i 
                  join item_part ip on i.id = ip.item_id
                    where ip.part_of_item_id in (select i.id
                      from items i
                        where i.required_ally is not null))
                        and m.queue_id = $2 and m.game_version like $3
                        group by item_name,i.image
                        order by uses desc
                        limit 10
    `, [champion,queue,version])
    return res.rows
  } catch (e) {
    console.log('Error getting the most used Items')
    return []
  }
}



module.exports = {
  itemByWinrate,
  commonItemsBySummonerChampion,
  commonItemsByChampion
}