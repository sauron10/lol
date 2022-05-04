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
    const file = '/home/heivagar/Documents/Code/express/lol/general/dragontail-12.7.1/12.7.1/data/en_US/profileicon.json'
    const f = fs.readFile(file, (err, data) => {
      if(err) throw err
      const icons = JSON.parse(data)
      for (var key in icons.data){
        // console.log(icons.data[key])
        dbIcon.addIcon(icons.data[key])
      }
    })
    return {status: ok}
  }catch(e){
    console.log(e)
  }
}

// Champion populators

const championPopulator = () => {
  try{
    const file = '/home/heivagar/Documents/Code/express/lol/general/dragontail-12.7.1/12.7.1/data/en_US/championFull.json'
    const f = fs.readFile(file, (err, data) => {
      if(err) throw err
      const champions = JSON.parse(data)
      for (var key in champions.data){
        dbChampion.addChampion({'version':champions.version,...champions.data[key]})
        // dbChampion.addSkin(champions.data[key])
        skinPopulator(champions.data[key])
        champTagPopulator(champions.data[key])
        relChampTagPopulator(champions.data[key])
      }
    })
    return {'status': 'ok'}
  }catch(e){
    console.log(e)
  }
}

const skinPopulator = (champ) => {
  for (var key in champ.skins){
    dbChampion.addSkin({'chId':champ.key,...champ.skins[key]})
  }
}

const champTagPopulator = champ => {
  for (var key in champ.tags){
    dbChampion.addTag(champ.tags[key])
  }
}

const relChampTagPopulator = champ => {
  for (var key in champ.tags){
    dbChampion.addTagRel({'tag':champ.tags[key],'chId':champ.key})
  }
}

const allChamps = async () => {
  return await dbChampion.getAllChamps()
}

// Items populators 

const itemPopulator = async () => {
  const file = '/home/heivagar/Documents/Code/express/lol/general/dragontail-12.7.1/12.7.1/data/en_US/item.json'
    const f = fs.readFile(file, (err, data) => {
      if(err) throw err
      const items = JSON.parse(data)
      for (var key in items.data){
        dbItem.addItem({'id': key,...items.data[key]})
        itemPartPopulator(items.data[key],key)
        itemGoldPopulator(items.data[key],key)
        itemTagPopulator(items.data[key])
        itemTagRelPopulator(items.data[key],key)
      }
    })
}

const itemPartPopulator = async (item,itemId) => {
  if (item.into) {
    item.into.forEach((part) => {
    dbItem.addItemPart({'part': parseInt(part),'itemId' : itemId})
  })}
}

const itemGoldPopulator = async (item,itemId) => {
    if (item.gold){
      dbItem.addItemGold({'id': itemId, ...item.gold})
    }
}

const itemTagPopulator = (item) => {
  if (item.tags){
    item.tags.forEach(async (tag) => {
      await dbItem.addItemTag(tag)
    })
        
  }
}

const itemTagRelPopulator = (item,itemId) => {
  if (item.tags){
    item.tags.forEach(async (tag) => {
      await dbItem.addItemTagRel(tag,itemId)
    })
  }
}

// Summoner spells populators

const summonerSpellPopulator = async() => {
  const file = '/home/heivagar/Documents/Code/express/lol/general/dragontail-12.7.1/12.7.1/data/en_US/summoner.json'
    const f = fs.readFile(file, (err, data) => {
      if(err) throw err
      const spells = JSON.parse(data)
      for (var key in spells){
        dbSpell.addSummonerSpell(spells.data[key])
      }
    })

}

// Runes populators

const runesPopulator = async() => {
  const file = '/home/heivagar/Documents/Code/express/lol/general/dragontail-12.7.1/12.7.1/data/en_US/runesReforged.json'
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