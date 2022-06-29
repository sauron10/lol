const db = require('../../index')

const versionList = async () => {
  try{
    const res = await db.query(`
    select game_version
    from match m
    where game_version is not null and game_version != ''
    group by game_version
    `)
    return res.rows
  }catch(e){
    console.log('Error getting matches versions: ',e)
    return []
  }
}

const queueList = async () => {
  try{
    const res = await db.query(`
    select queue_id
    from match m
    where queue_id is not null
    group by queue_id
    `)
    return res.rows
  }catch(e){
    console.log('Error getting matches queues: ',e)
    return []
  }
}

module.exports = {
  versionList,
  queueList
}