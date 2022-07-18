import { useEffect, useReducer } from "react"
import { useChampionStats } from "../championReq"
import { ChampionCard } from "./championCard"
import { Matchups } from "./matchups"
import { useNavigate } from "react-router-dom"

const reducer = (state, action) => {
  switch (action.type) {
    case 'restore':
      const { name } = action.payload
      return { name }
    case 'changeName':
      return { ...state, name: action.payload }
    case 'changeLane':
      return { ...state, lane: action.payload }
    default:
      return state
  }
}

export const ChampionDetails = (props) => {
  const [state, dispatch] = useReducer(reducer, { name: props.champion().champion, lane: '%' })
  const {
    loaded,
    bestSummoners,
    winratesXPatch,
    commonLanes,
    matchups,
    blurbs,

    getBestSummoners,
    getWinrateByPatch,
    getCommonLane,
    getChampionVsChampion,
    getChampionInfo
  } = useChampionStats()

  useEffect(() => {
    getBestSummoners(state.name)
    getCommonLane(state.name)
    getChampionInfo(state.name)
  }, [getChampionInfo, getCommonLane, getBestSummoners, state.name])

  useEffect(() => {
    getWinrateByPatch(state.name)
    getChampionVsChampion(state.name, state.lane)
  }, [getChampionVsChampion, state.lane, state.name, getWinrateByPatch])

  const nav = useNavigate()

  return (
    <>
      <div>
        {loaded && <ChampionCard
          {...state}
          winrates={winratesXPatch}
          lanes={commonLanes}
          info={blurbs}
          dispatch={dispatch} />}
      </div>
      <hr />
      <div className="my-5">
        <p className="title has-text-centered has-text-white">Best players</p>
        <table className="table has-text-centered background-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matches</th>
              <th>Winrate</th>
            </tr>
          </thead>
          <tbody>
            {bestSummoners?.map(player => (
              <tr key={player.summoner_name}>
                <th className="clickable" onClick={() => nav(`/summoner/${player.summoner_name}`)}>{player.summoner_name}</th>
                <td>{player.total}</td>
                <td>{player.wr}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <div className="mt-5">
        <p className="title has-text-centered has-text-white">Matchups</p>
        {loaded ? <Matchups vs={matchups} dispatch={dispatch} /> : <p>Cargando</p>}
      </div>
    </>
  )
}