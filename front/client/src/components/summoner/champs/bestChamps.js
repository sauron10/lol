import { useEffect, useCallback, useReducer } from "react"
import { useGetChamps } from "../../../customHooks/requestChamp"
import { ChampCard } from "./champCard"
import { ChampionDetails } from "./champDetails"

const init = () => {
  return {
    queue : 420,
    order : 'games',
  }
}

const ACTIONS = {
  RESTORE : 1,
  CHANGE_QUEUE : 2,
  CHANGE_ORDER : 3,
}

const reducer = (state,action) => {
  switch (action.type){
    case ACTIONS.RESTORE:
      return (init())
    case ACTIONS.CHANGE_QUEUE:
      return ({...state,order : init().order,queue : action.payload})
    case ACTIONS.CHANGE_ORDER:
      return ({...state,order : action.payload})
    default:
      return state

  }
}


export const BestChamps = (props) => {
  const [state, dispatch] = useReducer(reducer, {}, init)
  const [champs, setChamps] = useGetChamps(props.summoner, state.queue)
  const memoSetChamps = useCallback(setChamps,[setChamps])

  useEffect(() => {
    console.log('Order effect ran')
    const compare = (a,b) => {
      const aKda = (parseFloat(a.kills)+parseFloat(a.assists))/parseFloat(a.deaths)
      const bKda = (parseFloat(b.kills)+parseFloat(b.assists))/parseFloat(b.deaths)
      if (aKda > bKda) return -1
      return 1
    }
    switch (state.order) {
      case 'kda':
        return memoSetChamps((preChamps) => [...preChamps].sort(compare))
      case 'games':
        return memoSetChamps((preChamps) => [...preChamps].sort((a,b) => b.games - a.games))
      case 'farm':
        return memoSetChamps((preChamps) => [...preChamps].sort((a,b) => b.minions - a.minions))
      case 'duration':
        return memoSetChamps((preChamps) => [...preChamps].sort((a,b) => b.duration - a.duration))
      default:
        break
    }
  },[state.order,state.queue,memoSetChamps])

  return !props.champion.activated ? (
    <>
      <div className="tabs is-centered">
        <ul>
          <li className={state.queue === 420 ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_QUEUE, payload: 420})}><a>Solo</a></li>
          <li className={state.queue === 440 ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_QUEUE, payload: 440})}><a>Flex</a></li>
          <li className={state.queue === 400 ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_QUEUE, payload: 400})}><a>Normal</a></li>
          <li className={state.queue === 450 ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_QUEUE, payload: 450})}><a>ARAM</a></li>
        </ul>
      </div>

      <div className="tab-container">
        <div className="tabs is-centered">
          <ul className="champ-list">
            <li className={state.order === 'kda' ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_ORDER, payload:'kda'})}><a>KDA</a></li>
            <li className={state.order === 'games' ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_ORDER, payload:'games'})}><a>Games</a></li>
            <li className={state.order === 'farm' ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_ORDER, payload:'farm'})}><a>Farm</a></li>
            <li className={state.order === 'duration' ? 'is-active' : ''} onClick={() => dispatch({type:ACTIONS.CHANGE_ORDER, payload:'duration'})}><a>Duration</a></li>
          </ul>
        </div>
        {champs.length > 0 && champs?.map(champ => (
          <div className="container" key={champ.name} 
                onClick={() => {
                              props.setChampion(() => ({activated:true,champion:champ}))
                              props.setSelectedTab(() => state.queue)
                              }}>
            <ChampCard champ={champ} key={champ.name} />
          </div>
        ))}
      </div>

    </>
  ): <ChampionDetails setChampion={props.setChampion} champion={props.champion.champion} data={props.data}/>

}