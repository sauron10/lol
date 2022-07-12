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
      return {...state,name:action.payload}
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
    case 'changeLane':
      return {...state, lane:action.payload}
    default:
      return state
  }
}



export const ChampionDetails = (props) => {
  const [state, dispatch] = useReducer(reducer, { name: props.champion().champion, best: [], winrates: [], lanes: [], vs: [], info: {}, lane:'%' })
  const { bestSummoners, loaded, winrateByPatch, commonLane, championVsChampion, championInfo } = useChampionStats()

  useEffect(() => {
    bestSummoners(state.name).then(d => dispatch({ type: 'changeBest', payload: d }))
    commonLane(state.name).then(d => dispatch({ type: 'changeCommonLanes', payload: d }))
    championInfo(state.name).then(d => dispatch({ type: 'changeInfo', payload: d }))
  }, [championInfo,commonLane, bestSummoners, state.name])

  useEffect(() => {
    winrateByPatch(state.name).then(d => dispatch({ type: 'changeWinrate', payload: d }))
    championVsChampion(state.name,state.lane).then(d => dispatch({ type: 'changeChampionVsChampion', payload: d }))
  },[championVsChampion, state.lane, state.name, winrateByPatch])

  const nav = useNavigate()

  return (
    <>
      <div>
        {loaded && <ChampionCard {...state} dispatch={dispatch} />}
      </div>
      <hr/>
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
            {state?.best?.map(player => (
              <tr key={player.summoner_name}>
                <th className="clickable" onClick={() => nav(`/summoner/${player.summoner_name}`)}>{player.summoner_name}</th>
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
        {loaded ? <Matchups vs={state.vs} dispatch = {dispatch}/>:<p>CArgando</p>}
       </div>
    </>
  )
}