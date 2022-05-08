const db = require('./index')
const sqlTools = require('./sql_helper')

const addChampion = async champion => {
  try{
    const query = {
      text : 'INSERT INTO champion VALUES ($1,$2,$3,$4,$5,$6,$7)',
      values : [
        champion.key,
        champion.name,
        champion.version,
        champion.title,
        champion.lore,
        champion.blurb,
        champion.image.full,
      ]
    }
    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log(e)
  }

}

const addSkin = async skin => {
  try{
    const query = {
      text : 'INSERT INTO champion_skins VALUES ($1,$2,$3,$4,$5)',
      values : [
        skin.id,
        skin.chId,
        skin.name,
        skin.num,
        skin.chromas,
      ]
    }
    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log(e)
  }

}

const addTag = async tag => {
  try{
    const res = await db.query('INSERT INTO champion_tags (tag) VALUES ($1)',[tag])
    return res.rows
  }catch(e){
    console.log(e)
  }
  
}

const addTagRel = async obj => {
  try{
    const tagIdRows = await db.query('SELECT id FROM champion_tags WHERE tag = $1',[obj.tag]) 
    const tagId = tagIdRows.rows[0].id
    console.log("tagId",tagId)
    const res = await db.query('INSERT INTO champion_tags_interm (champion_tag_id,champion_id) VALUES ($1,$2)',[tagId,obj.chId])
    return res.rows
  }catch(e){
    console.log(e)
  }  
}

const getAllChamps = async () => {
  try{
    const nestedQTags = sqlTools.nestQuery(`
      SELECT tag
      FROM champion_tags_interm t
      JOIN champion_tags ct ON ct.id = t.champion_tag_id
      WHERE t.champion_id = champion.id
    `)

    const nestedQSkins = sqlTools.nestQuery(`
      SELECT name
      FROM champion_skins cs
      WHERE cs.champion_id = champion.id    
    `)

    const res = await db.query(`
    SELECT name,title,lore,blurb,image,
    ${nestedQTags} as tags,
    ${nestedQSkins} as skins
    FROM champion`,[])
    return res.rows
  }catch(e){
    console.log(e)
  }
}

const getChamp = async champId => {
  try{
    const res = await db.query('SELECT')

  }catch(e){

  }
}

module.exports = {
  addChampion,
  addSkin,
  addTag,
  addTagRel,
  getAllChamps,
}