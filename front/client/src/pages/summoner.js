import Nav from "../components/nav";
import SummonerCard from "../components/summoner/summonerCard";
import { useGetSummoner } from "../customHooks/requestSummoner";
import { Achievement } from "../components/summoner/achievementsCard";
import { Match } from "../components/summoner/match";
import { useEffect, useReducer, useMemo } from "react";
import { MatchFilter } from "../components/summoner/matchFilter";
import { useWindowDimensions } from "../customHooks/window";
import { BestChamps } from "../components/summoner/champs/bestChamps";
import { PlayedWith } from "../components/summoner/played/playedWith";
import { useParams } from "react-router-dom";

const ACTIONS = {
  restore: 1,
  changeIndex: 2,
  changeTab: 3,
  changeChampion: 4,
  openChampionCard: 5,
  changeMatchTab: 6

}


export const Summoner = (props) => {

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.restore:
        cleanMatches()
        return { index: 20, tab: 1, champion: { activated: false, champion: {} } }
      case ACTIONS.changeIndex:
        return { ...state, index: action.payload }
      case ACTIONS.changeTab:
        return { ...state, tab: action.payload }
      case ACTIONS.changeChampion:
        return { ...state, champion: action.payload }
      case ACTIONS.openChampionCard: {
        cleanMatches()
        return action.payload
      }
      case ACTIONS.changeMatchTab: {
        cleanMatches()
        // const {tab,index} = action.payload
        return { ...action.payload, champion: { activated: false, champion: {} } }
      }
      default:
        return state
    }
  }

  const { summonerName: summoner } = useParams()
  const {
    data,
    updateData,
    loaded,
    updateProfileData,
    getSeasonMatches,
    cleanMatches,
    time,
    winrate,
    getWinrate,
    getWastedTime,
  } = useGetSummoner(
    summoner);

  const [state, dispatch] = useReducer(reducer, { index: 20, tab: 1, champion: { activated: false, champion: {} } })
  const { width } = useWindowDimensions()
  const matchList = useMemo(() => data?.matches?.map(match => match?.match_id) ?? [], [data])


  
  useEffect(() => {
    updateData(state.index, state.tab, state.champion.champion.id,matchList);
  }, [state.index,state.tab, updateData])

  useEffect(() => {
    dispatch({type:ACTIONS.changeChampion, payload:{activated:false,champion:{}}})
  },[summoner])
  
  useEffect(() => {
    getWinrate(summoner)
    getWastedTime()
  }, [summoner, getWinrate,getWastedTime,data?.summoner_name])

  const loadMore = () => {
    dispatch({ type: ACTIONS.changeIndex, payload: state.index + 20 })
  }

  const updateProfile = () => {
    dispatch({ type: ACTIONS.changeIndex, payload: 20 })
    updateProfileData(state.tab)
  }

  const isLoaded = data !== null;

  const hasMatches = () => {
    if (data.matches) {
      return data.matches.length > 0
    }
    return false
  }

  // console.log(index)

  return (
    <>
      <Nav page={'summoner'} dispatch={dispatch} />
      <div className='columns is-centered ' style={width < 1500 ? { maxWidth: width } : {}}>
        {/* Padding */}
        {width > 2000 ? <div className="column is-0 is-2-fullhd"></div> : <></>}

        {/* First column */}
        <div className="column is-narrow p-0 m-5">
          {isLoaded && <SummonerCard summoner={data} updateProfile={updateProfile} getSeasonMatches={getSeasonMatches} loaded={loaded} time={time} winrate={winrate} />}
          <PlayedWith summoner={summoner} queue={state.tab} />
        </div>
        {/* Second column */}
        <div className="column p-0 m-5 matches-column">
          <div className="px-6">
            <div className="columns">
              <div className="column">
                {isLoaded && <Achievement summoner={data} />}
              </div>
              <div className="column">
                {isLoaded && <Achievement summoner={data} />}
              </div>
              <div className="column">
                {isLoaded && <Achievement summoner={data} />}
              </div>
            </div>
          </div>
          {isLoaded && (
            <MatchFilter state={state} dispatch={dispatch} ACTIONS={ACTIONS} />
          )}

          {isLoaded &&
            hasMatches() &&
            data.matches.map((match) => (
              <Match
                summoner={match}
                key={`${match.match_id}`}
                position={width}
                loaded={loaded}
              />
            ))}

          <div className="level">
            <div className="level-item">
              <button className={loaded ? 'button my-3' : 'button my-3 is-info is-loading'} onClick={loadMore}>
                Load More
              </button>
            </div>
          </div>
        </div>
        {/* Third column */}
        {(width > 1100 || width < 770) && <div className="column is-narrow p-0 mt-5 mr-5">
          <BestChamps
            summoner={summoner}
            state={state}
            dispatch={dispatch}
            data={data?.matches}
            ACTIONS={ACTIONS}
          />
        </div>}
        {/* Padding */}
        {width > 2000 ? <div className="column is-0 is-2-fullhd"></div> : <></>}

      </div>
    </>
  );
};

