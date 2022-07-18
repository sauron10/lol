const dbSumm = require('../database/summoner')
const dbIcon = require('../database/profileIcon')
const dbChampion = require('../database/champion')
const dbItem = require('../database/item')
const dbSpell = require('../database/summonerSpells')
const dbRunes = require('../database/runes')
const fs = require('fs')

// Icon populators

const profileIconPopulator = async () => {
  try{
    const file = '../jsons/en_US/profileicon.json'
    const f = fs.readFile(file, (err, data) => {
      if(err) throw err
      const icons = JSON.parse(data)
      for (var key in icons.data){
        // console.log(icons.data[key])
        dbIcon.addIcon(icons.data[key])
      }
    })
    return {status: "ok"}
  }catch(e){
    console.log('Error in icon populator: ',e)
  }
}

// Champion populators

const championPopulator = async () => {
  try{
    const file = '../jsons/en_US/championFull.json'
    const f = fs.readFile(file, async (err, data) => {
      if(err) throw err
      const champions = JSON.parse(data)
      for (var key in champions.data){
        await dbChampion.addChampion({'version':champions.version,...champions.data[key]})
        await skinPopulator(champions.data[key])
        await champTagPopulator(champions.data[key])
        await relChampTagPopulator(champions.data[key])
      }
    })
    return {'status': 'ok'}
  }catch(e){
    console.log('Error in champion populator: ',e)
  }
}

const skinPopulator = async(champ) => {
  for (var key in champ.skins){
    await dbChampion.addSkin({'chId':champ.key,...champ.skins[key]})
  }
}

const champTagPopulator =async champ => {
  for (var key in champ.tags){
    await dbChampion.addTag(champ.tags[key])
  }
}

const relChampTagPopulator = async champ => {
  for (var key in champ.tags){
    await dbChampion.addTagRel({'tag':champ.tags[key],'chId':champ.key})
  }
}

const allChamps = async () => {
  return await dbChampion.getAllChamps()
}

// Items populators 

const itemPopulator = async () => {
  const file = '../jsons/en_US/item.json'
    const f = fs.readFile(file, async(err, data) => {
      if(err) throw err
      const items = JSON.parse(data)
      for (var key in items.data){
        await dbItem.addItem({'id': key,...items.data[key]})
        await itemPartPopulator(items.data[key],key)
        await itemGoldPopulator(items.data[key],key)
        await itemTagPopulator(items.data[key])
        await itemTagRelPopulator(items.data[key],key)
      }
    })
}

const itemPartPopulator = async (item,itemId) => {
  if ('into' in item) {
    item.into.forEach(async (part) => {
    await dbItem.addItemPart({'part': parseInt(part),'itemId' : parseInt(itemId)})
  })}
}

const itemGoldPopulator = async (item,itemId) => {
    if (item.gold){
      dbItem.addItemGold({'id': itemId, ...item.gold})
    }
}

const itemTagPopulator = async (item) => {
  if (item.tags){
    item.tags.forEach(async (tag) => {
      await dbItem.addItemTag(tag)
    })
        
  }
}

const itemTagRelPopulator = async (item,itemId) => {
  if (item.tags){
    item.tags.forEach(async (tag) => {
      await dbItem.addItemTagRel(tag,itemId)
    })
  }
}

// Summoner spells populators

const summonerSpellPopulator = async() => {
  const file = '../jsons/en_US/summoner.json'
    const f = fs.readFile(file, async(err, data) => {
      if(err) throw err
      const spells = JSON.parse(data)
      for (var key in spells.data){
        // console.log(spells.data[key])
       await dbSpell.addSummonerSpell(spells.data[key])
      }
    })

}

// Runes populators

const runesPopulator = async() => {
  const file = '../jsons/en_US/runesReforged.json'
    const f = fs.readFile(file, (err, data) => {
      if(err) throw err
      const runes = JSON.parse(data)
      runes.forEach((runeCat) => {
        runeCat.slots.forEach((slot) => {
          slot.runes.forEach(async (rune) => {
            await dbRunes.addRune(rune)
          })
        })
      })
    })
}

module.exports = {
  profileIconPopulator,
  championPopulator,
  allChamps,
  itemPopulator,
  summonerSpellPopulator,
  runesPopulator,
}