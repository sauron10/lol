import { useMemo } from "react"
import { ChampionImage } from "../championImage"
import { KdaChart } from "./charts/kdaChart"
import { FarmChart } from "./charts/farmChart"
import { GamesChart } from "./charts/gamesChart"
import { KPChart } from "./charts/killPartChat"


export const DetailsHeader = (props) => {

  const dataLists = useMemo(() => {
    const obj = {
      victoryData: [
        { value: parseInt(props.champion.wins), name: `${props.champion.wins} wins` },
        { value: parseInt(props.champion.losses), name: `${props.champion.losses} losses` }
      ],
      kaData: [],
      dData: [],
      csData: [],
      kpData: [],
    }
    props?.data.map((match, index, arr) => {
      obj.kaData = [...obj['kaData'], { name: index + 1, ka: parseInt(match.kills) + parseInt(match.assists), deaths: parseInt(match.deaths) }]
      obj.csData = [...obj['csData'], { name: index + 1, value: (match.minions_killed / match.game_duration * 60).toFixed(1) }]
      obj.kpData = [...obj['kpData'], { name: index + 1, kp: parseFloat(match.kp) }]
      return match
    })
    return obj
  }, [props.data, props.champion])

  return (
    <>
      <div className="columns mr-4">
        <div className="column is-narrow has-text-centered">
          <div className="has-text-centered">
            <ChampionImage image={props.champion.image} size={'is-96x96'} />
          </div>
            <GamesChart data={dataLists.victoryData} />
            <p className="title has-text-white pb-5">Games</p>
            <KdaChart data={[...dataLists.kaData].reverse()} />
            <p className="title has-text-white pb-5">KDA</p>
            <FarmChart data={[...dataLists.csData].reverse()} />
            <p className="title has-text-white pb-5">Minions per minute </p>
            <KPChart data={[...dataLists.kpData].reverse()} />
            <p className="title has-text-white pb-5">Kill participation</p>
        </div>
      </div>
    </>
  )
}