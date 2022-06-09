export const filterEmblem = (leagues) => {
  let soloLeague = []
  let flexLeague = []
  leagues.forEach(league => {
    if (league.queue_type === 'RANKED_SOLO_5x5'){
      soloLeague = [...soloLeague,league]
    }
    if (league.queue_type === 'RANKED_FLEX_SR'){
      flexLeague = [...flexLeague,league]
    }
  })

  return [soloLeague,flexLeague]
}

export const getFirstEmblems = leagues => {
  const filteredEmblems = filterEmblem(leagues)
  let first = []
  filteredEmblems.forEach((list) => {
    if (list.length > 0) first = [...first,list[0]]
  })
  return first
}