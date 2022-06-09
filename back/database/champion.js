const db = require('./index')
const sqlTools = require('./sql_helper')

const addChampion = async champion => {
  try{
    const query = {
      text : `INSERT INTO champion VALUES ($1,$2,$3,$4,$5,$6,$7)
              ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              version = EXCLUDED.version,
              title = EXCLUDED.title,
              lore = EXCLUDED.lore,
              blurb = EXCLUDED.blurb,
              image = EXCLUDED.image`,
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
    console.log('Error adding champion: ',e)
  }

}

const addSkin = async skin => {
  try{
    const query = {
      text : `INSERT INTO champion_skins VALUES ($1,$2,$3,$4,$5)
              ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              num = EXCLUDED.num,
              chromas = EXCLUDED.chromas`,
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
    console.log('Error adding skin: ',e)
  }

}

const addTag = async tag => {
  try{
    const res = await db.query('INSERT INTO champion_tags (tag) VALUES ($1) ON CONFLICT (tag) DO NOTHING',[tag])
    return res.rows
  }catch(e){
    console.log('Error adding a tag: ',e)
  }
  
}

const addTagRel = async obj => {
  try{
    const tagIdRows = await db.query('SELECT id FROM champion_tags WHERE tag = $1',[obj.tag]) 
    const tagId = tagIdRows.rows[0].id
    const res = await db.query('INSERT INTO champion_tags_interm (champion_tag_id,champion_id) VALUES ($1,$2) ON CONFLICT (champion_tag_id,champion_id) DO NOTHING',[tagId,obj.chId])
    return res.rows
  }catch(e){
    console.log('Error adding a tag rel: ',e)
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