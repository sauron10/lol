// const { query } = require('./index')
const db = require('./index')

const addItem = async item => {
  try{
    const query = {
      text : 'INSERT INTO items VALUES ($1,$2,$3,$4,$5) RETURNING *',
      values : [
        item.id,
        item.name,
        item.description,
        item.plaintext,
        item.image.full
      ]
    }

    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log(e)
  }

}
const addItemPart = async itemPart => {
  try{
    const res = await db.query('INSERT INTO item_part VALUES ($1,$2)',[itemPart.itemId, itemPart.part])
    return res.rows
  }catch(e){

  }
}

const addItemGold = async itemGold => {
  try{
    const query = {
      text : 'INSERT INTO item_gold VALUES ($1,$2,$3,$4)',
      values : [
        itemGold.id,
        itemGold.base,
        itemGold.total,
        itemGold.sell,
      ]
    }
    const res = await db.query(query)
    return res
  }catch(e){

  }
}

const addItemTag = async tag => {
  try{
    const res = await db.query('INSERT INTO item_tags VALUES ($1)',[tag])
  }catch(e){
    console.log(e)
  }
}

const addItemTagRel = async (tag,idItem) => {
  try{
    const resTag = await db.query('SELECT id FROM item_tags WHERE tag = $1',[tag])
    const resIdTag = resTag.rows[0].id
    const res = await db.query('INSERT INTO item_tags_interm VALUES ($1,$2)',[resIdTag,idItem])
    return res.rows
  }catch(e){
    console.log(e)
  }
}

module.exports = {
  addItem,
  addItemPart,
  addItemGold,
  addItemTag,
  addItemTagRel,
}