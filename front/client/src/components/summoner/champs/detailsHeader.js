import {useMemo } from "react"
import { ChampionImage } from "../championImage"
import { KdaChart } from "./charts/kdaChart"
import { FarmChart } from "./charts/farmChart"
import { GamesChart } from "./charts/gamesChart"


export const DetailsHeader = (props) => {

  const dataLists = useMemo(() => {
      const obj = {
        victoryData: [
          {value: parseInt(props.champion.wins), name: `${props.champion.wins} wins` },
          {value: parseInt(props.champion.losses), name: `${props.champion.losses} losses` }
        ],
        kaData: [],
        dData: [],
        csData: []
      }
      props?.data.map((match, index, arr) => {
        obj.kaData = [...obj['kaData'], { name: index +1, ka: parseInt(match.kills) + parseInt(match.assists), deaths:parseInt(match.deaths)}]
        obj.csData = [...obj['csData'], { name: index +1, value: match.minions_killed}]
        return match
    })
    return obj
  }, [props.data,props.champion])

  return (
    <>
      <div className="columns mr-4">
        <div className="column is-narrow">
          <div className="has-text-centered">
            <ChampionImage image={props.champion.image} size={'is-96x96'} />
          </div>
            <GamesChart data={dataLists.victoryData} />
            <KdaChart data={[...dataLists.kaData].reverse()} />
            <FarmChart data={[...dataLists.csData].reverse()} />
        </div>
      </div>
    </>
  )
}