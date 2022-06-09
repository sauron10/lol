// const { query } = require('./index')
const db = require('./index')

const addItem = async item => {
  try{
    const query = {
      text : `INSERT INTO items
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE
       SET item_name = EXCLUDED.item_name,
            description = EXCLUDED.description,
            plain_text = EXCLUDED.plain_text,
            image = EXCLUDED.image`,
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
    console.log('Error adding item: ',e)
  }

}
const addItemPart = async itemPart => {
  try{
    const res = await db.query(`INSERT INTO item_part
                              (item_id,part_of_item_id)
                               VALUES ($1,$2) ON CONFLICT (item_id,part_of_item_id) DO UPDATE
                               SET item_id = EXCLUDED.item_id,
                                    part_of_item_id = EXCLUDED.part_of_item_id`,
                               [
                                 itemPart.itemId,
                                 itemPart.part
                                ])
    return res.rows
  }catch(e){
    console.log(e)
  }
}

const addItemGold = async itemGold => {
  try{
    const query = {
      text : `INSERT INTO item_gold
              (item_id,base,total,sell)
              VALUES ($1,$2,$3,$4) ON CONFLICT (item_id) DO UPDATE
              SET item_id = EXCLUDED.item_id,
                  base = EXCLUDED.base,
                  total = EXCLUDED.total,
                  sell = EXCLUDED.sell`,
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
    console.log('Error adding Item Gold: ',e)
  }
}

const addItemTag = async tag => {
  try{
    const res = await db.query('INSERT INTO item_tags (tag) VALUES ($1) ON CONFLICT (tag) DO NOTHING',[tag])
  }catch(e){
    console.log('Error adding item tag: ',e)
  }
}

const addItemTagRel = async (tag,idItem) => {
  try{
    const resTag = await db.query('SELECT id FROM item_tags WHERE tag = $1',[tag])
    const resIdTag = resTag.rows[0].id
    const res = await db.query(`INSERT INTO item_tags_interm 
                              (item_tag_id,item_id)
                               VALUES ($1,$2) ON CONFLICT (item_tag_id,item_id) DO NOTHING`,
                               [resIdTag,idItem])
    return res.rows
  }catch(e){
    console.log('Error adding item tag rel: ',e)
  }
}

module.exports = {
  addItem,
  addItemPart,
  addItemGold,
  addItemTag,
  addItemTagRel,
}