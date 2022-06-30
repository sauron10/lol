const db = require('../../index')
const sqlTools = require('../../sql_helper')

const championsByWinrate = async (queue, version) => {
  try {

    const banrate = `
    select c.name,
    cast((count(*)*100.0/(select count(*)
    from match m
    where m.game_version like $2 and m.queue_id = $1)) as decimal(5,2) ) as ban_rate
    from bans b
    join team t on b.team_id = t.id
    join match m on m.id = t.match_id 
    join champion c on c.id = b.champion_id
    where m.game_version like $2 and m.queue_id = $1
    group by c.name
    order by ban_rate desc
    `
    const pickrate = `
    select c.name,
    cast((count(*)*100.0/(select count(*)
    from match m
    where m.game_version like $2 and m.queue_id = $1)) as decimal(5,2) ) as pick_rate
    from match_summoner ms 
    join champion_ms cm on cm.match_summoner_id = ms.id 
    join champion c on c.id = cm.champion_id
    join match m on m.id = ms.match_id 
    where m.game_version like $2 and m.queue_id = $1
    group by c.name
    order by pick_rate desc
    `
    const hasBans = () => {
      if ([420, 400, 440].includes(parseInt(queue))) {
        return `join (${banrate}) brt on brt.name = wrt.name`
      }
      return ''
    }

    const res = await db.query(`
    select * from
    (select c.name,c.image, ms.individual_position,
    count(*) as games,
    count(*) filter(where ms.win = true) as wins,
    cast((count(*) filter(where ms.win = true)*100.0/count(*)) as decimal(5,2)) as wr
      from match_summoner ms
      join champion_ms cm on cm.match_summoner_id = ms.id 
      join champion c on c.id = cm.champion_id
      join match m on m.id = ms.match_id
        where m.game_version like $2 and m.queue_id = $1 and individual_position is not null
        group by c.name,c.image,ms.individual_position
        having count(*) > 100
        order by wr desc) wrt
          ${hasBans()}
          join (${pickrate}) prt on prt.name = wrt.name
          order by wr desc

    `, [queue, version])
    return res.rows
  } catch (e) {
    console.log('Error getting champion by winrate list: ', e)
    return []
  }
}

const championInfo = async (champion) => {
  try{
    const tags = sqlTools.nestQuery(`
    select tag
    from champion_tags ct
    join champion_tags_interm cti on cti.champion_tag_id = ct.id
    where c.id = cti.champion_id
    `)

    const skins = sqlTools.nestQuery(`
    select * 
    from champion_skins cs
    where cs.champion_id = c.id
    `)

    const res = await db.query(`
    select *,
    ${skins} as skins,
    ${tags} as tags
    from champion c
    where lower(c.name) = lower($1)
    `,[champion])
    return res.rows
  }catch(e){
    console.log('Error getting the champion information: ',e)
    return []
  }
}

const summonerChampionBestWinrate = async (champion, queue) => {
  try {
    const res = await db.query(`
    select s.summoner_name,
    count(*) as total,
    count(*) filter(where ms.win = true) as wins,
    (count(*) filter(where ms.win = true)*100/count(*)) as wr
      from summoner s
      join match_summoner ms on s.id = ms.summoner_id
      join champion_ms cm on cm.match_summoner_id = ms.id 
      join champion c on c.id = cm.champion_id
      join match m on m.id = ms.match_id 
        where lower(c.name) = lower($1) and m.queue_id = $2
        group by s.summoner_name
        having count(*)>10
        order by wr desc
        limit 10
    `, [champion, queue])
    return res.rows

  } catch (e) {
    console.log('Error getting summoner-champs with best winrate: ', e)
    return []
  }
}

const championWinrateByPatch = async (champion, queue) => {
  try {
    const res = await db.query(`
    select game_version,
    count(*) as games,
    count(*) filter(where ms.win = true) as wins,
    (count(*) filter(where ms.win = true)*100/count(*)) as wr
      from match_summoner ms
      join champion_ms cm on cm.match_summoner_id = ms.id 
      join champion c on c.id = cm.champion_id
      join match m on m.id = ms.match_id
        where lower(c.name) = lower($1) and m.queue_id = $2
        group by game_version
        having count(*) > 20
        order by game_version desc
    `, [champion, queue])
    return res.rows

  } catch (e) {
    console.log('Error getting champion winrate by patch: ', e)
    return []
  }
}

const commonLaneForChampion = async (champion, version) => {
  try {
    const res = await db.query(`
    select c.name, ms.individual_position,
    count(*) as games
      from match_summoner ms
      join champion_ms cm on cm.match_summoner_id = ms.id 
      join champion c on c.id = cm.champion_id
      join match m on m.id = ms.match_id
        where lower(c."name") = lower($1) and individual_position != 'Invalid' and m.game_version like $2
        group by c.name, ms.individual_position
        order by games desc
    `, [champion, version])
    return res.rows

  } catch (e) {
    console.log('Error getting common lanes for a champion: ', e)
    return []
  }
}

const championVsChampionWinrate = async (champion, position, queue) => {
  try {
    const res = await db.query(`
    select c.name,c.image,
    count(*) as matches,
    count(*) filter(where ms.win = true) as wins,
    cast((count(*) filter(where ms.win = true)*100.0/count(*))as decimal(5,2) ) as winrate
      from match_summoner ms
      join champion_ms cm on cm.match_summoner_id = ms.id 
      join champion c on c.id = cm.champion_id
        where ms.match_id in (select m.id
          from match_summoner ms
          join champion_ms cm on cm.match_summoner_id = ms.id 
          join champion c on c.id = cm.champion_id
          join match m on ms.match_id = m.id
            where lower(c."name") = lower($1) and m.queue_id = $3) and lower(ms.individual_position) = lower($2) and lower(c.name) != lower($1) 
            group by c.name,c.image,ms.individual_position
            having count(*) > 20
            order by winrate desc    
    `, [champion, position, queue])
    return res.rows
  } catch (e) {
    console.log('Error getting the champion vs champion winrate: ', e)
    return []
  }
}





module.exports = {
  championsByWinrate,
  summonerChampionBestWinrate,
  championWinrateByPatch,
  commonLaneForChampion,
  championVsChampionWinrate,
  championInfo
}