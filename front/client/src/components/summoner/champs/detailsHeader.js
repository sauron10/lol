import { useEffect, useState } from "react"
import { ChampionImage } from "../championImage"
import { KdaChart } from "./charts/kdaChart"
import { FarmChart } from "./charts/farmChart"
import { GamesChart } from "./charts/gamesChart"


export const DetailsHeader = (props) => {
  const [dataLists, setDataLists] = useState({})

  useEffect(() => {
    setDataLists(() => {
      const obj = {
        victoryData: [
          { x: 1, y: parseInt(props.champion.wins), label: `W: ${props.champion.wins}` },
          { x: 2, y: parseInt(props.champion.losses), label: `L: ${props.champion.losses}` }
        ],
        kaData: [],
        dData: [],
        csData: []
      }

      props?.data.map((match, index, arr) => {
        obj.kaData = [...obj['kaData'], { x: arr.length - index, y: parseInt(match.kills) + parseInt(match.assists), l: 'kills' }]
        obj.dData = [...obj['dData'], { x: arr.length - index, y: parseInt(match.deaths), l: 'deaths' }]
        obj.csData = [...obj['csData'], { x: arr.length - index, y: match.minions_killed, }]
        return match
      })
      return obj
    })
  }, [props])

  return (
    <>
      <div className="columns mr-4">
        <div className="column is-narrow">
          <div className="has-text-centered">
            <ChampionImage image={props.champion.image} size={'is-96x96'} />
          </div>
          <div className="chart-container">
            <GamesChart victoryData={dataLists.victoryData} />
          </div>
          <div className="chart-container">
            <KdaChart dataLists={dataLists} />
          </div>
          <div className="chart-container">
            <FarmChart dataLists={dataLists} />
          </div>
        </div>
      </div>
    </>
  )
}