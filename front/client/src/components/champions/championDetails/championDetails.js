import { useEffect, useReducer } from "react"
import { useChampionStats } from "../championReq"
import { ChampionCard } from "./championCard"
import { Matchups } from "./matchups"

const reducer = (state, action) => {
  switch (action.type) {
    case 'restore':
      const { name } = action.payload
      return { name }
    case 'changeBest':
      return { ...state, best: action.payload }
    case 'changeWinrate':
      return { ...state, winrates: action.payload }
    case 'changeCommonLanes':
      return { ...state, lanes: action.payload }
    case 'changeChampionVsChampion':
      return { ...state, vs: action.payload }
    case 'changeInfo':
      return { ...state, info: action.payload }
    default:
      return state
  }
}



export const ChampionDetails = (props) => {
  const [state, dispatch] = useReducer(reducer, { name: props.champion().champion, best: [], winrates: [], lanes: [], vs: [], info: {} })
  const { bestSummoners, loaded, winrateByPatch, commonLane, championVsChampion, championInfo } = useChampionStats()

  useEffect(() => {
    bestSummoners(state.name).then(d => dispatch({ type: 'changeBest', payload: d }))
    winrateByPatch(state.name).then(d => dispatch({ type: 'changeWinrate', payload: d }))
    commonLane(state.name).then(d => dispatch({ type: 'changeCommonLanes', payload: d }))
    championVsChampion(state.name).then(d => dispatch({ type: 'changeChampionVsChampion', payload: d }))
    championInfo(state.name).then(d => dispatch({ type: 'changeInfo', payload: d }))
  }, [championInfo, championVsChampion, commonLane, winrateByPatch, bestSummoners, state.name])



  return (
    <>
      <div>
        {loaded && <ChampionCard {...state} />}
      </div>
      <hr/>
      <div className="my-5">
        <p className="title has-text-centered has-text-white">Best players</p>
        <table className="table has-text-centered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Matches</th>
              <th>Winrate</th>
            </tr>
          </thead>
          <tbody>
            {state?.best?.map(player => (
              <tr key={player.summoner_name}>
                <th>{player.summoner_name}</th>
                <td>{player.total}</td>
                <td>{player.wr}%</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
       <hr/>
       <div className="my-5">
        <p className="title has-text-centered has-text-white">Matchups</p>
        <Matchups vs={state.vs}/>
       </div>
    </>
  )
}