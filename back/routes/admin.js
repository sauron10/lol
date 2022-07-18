const express = require('express')
const router = express.Router()
const populators = require('../logic/populators')

router.post('/admin/', async (req, res, next) => {
  let result
  switch (req.body.type) {
    case 'icons':
      result = await populators.profileIconPopulator()
    case 'champs':
      result = await populators.championPopulator()
    case 'items':
      result = await populators.itemPopulator()
    case 'spells':
      result = await populators.summonerSpellPopulator()
    case 'runes':
      result = await populators.runesPopulator()
    case 'league':
      break
    default:
      throw 'This is not an avalable command'
  }
  return res.json(result)
})

module.exports = router