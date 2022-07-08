import { useEffect, useMemo, useReducer } from "react"
import { useChampionStats } from "./championReq"
import { ChampionRow } from "./championRow"
import { ChampionFilters } from "./championFilters"
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ACTIONS = {
  changeVersion: 1,
  changeQueue: 2,
  changeName: 3,
  changeLane: 4,
  orderBy: 5
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.changeQueue:
      return { ...state, queue: action.payload }
    case ACTIONS.changeVersion:
      const version = action.payload?.split('.')
      const versionNumbers = version?.map(n => {
        if (isNaN(parseInt(n))) return n
        return parseInt(n)
      })
      return { ...state, version: `${versionNumbers.join('.')}%` }
    case ACTIONS.changeName:
      return { ...state, name: action.payload }
    case ACTIONS.changeLane:
      return { ...state, lane: action.payload }
    case ACTIONS.orderBy:
      return { ...state, order: action.payload }
    default:
      return state
  }
}

const orderBy = (arr, param) => {
  switch (param) {
    case 'winrate': {
      const sortedArr = arr.sort((a, b) => parseFloat(b.wr) - parseFloat(a.wr))
      return sortedArr
    }
    case 'pickrate': {
      const sortedArr = arr.sort((a, b) => parseFloat(b.pick_rate) - parseFloat(a.pick_rate))
      return sortedArr
    }
    case 'banrate': {
      const sortedArr = arr.sort((a, b) => parseFloat(b.ban_rate) - parseFloat(a.ban_rate))
      return sortedArr
    }
    default:
      return arr
  }
}

export const ChampionsList = () => {
  const {data:champions, versions, loaded, championByWinrate, matchVersions} = useChampionStats()
  const [state, dispatch] = useReducer(reducer, { queue: 420, version: '%', name: '', lane: 'ANY', order: 'winrate' })
  const orderedChampions = useMemo(() => {
    return orderBy(champions ?? [], state.order)
  }, [state.order, champions])
  const filteredChampions = useMemo(() =>
    orderedChampions?.filter(champion => (
      champion.individual_position === state.lane ||
      state.lane === 'ANY') &&
      champion?.name?.toLowerCase().includes(state.name.toLowerCase()))
    , [orderedChampions, state])

  useEffect(() => {
    matchVersions()
  }, [matchVersions])

  useEffect(() => {
    championByWinrate(state.queue, state.version)
  }, [state.queue, state.version, championByWinrate])

  const isLane = useMemo(() => {
    if ([420, 400, 440].includes(parseInt(state.queue))) {
      return true
    }
    dispatch({ type: ACTIONS.changeLane, payload: 'ANY' })
    return false
  }, [state.queue])


  return (
    <>
      <ChampionFilters versions={versions} dispatch={dispatch} ACTIONS={ACTIONS} name={state.name} isLane={isLane} />
      <div className="table-container">
        <table className="table has-text-centered background-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th className="clickable" onClick={() => dispatch({ type: ACTIONS.orderBy, payload: 'winrate' })}>
                Winrate {state.order === 'winrate' &&
                  <FontAwesomeIcon icon={faArrowDownWideShort} />}
              </th>
              <th className="clickable" onClick={() => dispatch({ type: ACTIONS.orderBy, payload: 'pickrate' })}>
                Pickrate {state.order === 'pickrate' &&
                  <FontAwesomeIcon icon={faArrowDownWideShort} />}
              </th>
              <th className="clickable" onClick={() => dispatch({ type: ACTIONS.orderBy, payload: 'banrate' })}>
                Banrate {state.order === 'banrate' &&
                  <FontAwesomeIcon icon={faArrowDownWideShort} />}
              </th>
            </tr>
          </thead>
          <tbody>
            {loaded && filteredChampions?.map(champion => <ChampionRow champion={champion} key={`${champion.name},${champion.individual_position}`} />)}
          </tbody>
        </table>
      </div>
    </>
  )
}