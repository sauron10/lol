import { useMemo } from "react"
import { ChampionImage } from "../../summoner/championImage"
import { GamesChart } from "../../summoner/champs/charts/gamesChart"
import { WinrateChart } from "./winrateChart"
import { useWindowDimensions } from "../../../customHooks/window"

const safeName = (name) => {
  return name.replace(/[' ]/i, '')
}

const padPatch = patch => {
    const parts = patch.split('.').slice(0,2)
    const paddedParts = parts.map(part => part.padStart(2,'0'))
    return paddedParts.join('.')
}

export const ChampionCard = (props) => {
  const {width} = useWindowDimensions()

  const games = useMemo(() => {
    return props?.lanes?.map((lane, index) => ({ y: parseInt(lane.games), label: (index < 3 ? lane.individual_position.slice(0, 3) : ' ') }))
  }, [props.lanes])

  const winrate = useMemo(() => {
    const winrates = props?.winrates?.map(winrate => ({x:padPatch(winrate.game_version),y: parseInt(winrate.wr)}))
    return [...winrates].sort((a,b) => a.x-b.x)
  }, [props.winrates])

  return (
    <>
      <div className="columns is-gapless" style={{width:`${width}px`}}>
        <div className="column is-three-fifths is-offset-one-fifth">
          <div className="card" style={
            {
              backgroundImage: `url(${process.env.PUBLIC_URL}/champion/centered/${safeName(props?.info?.name ?? '')}_3.jpg)`,
              backgroundPosition: '25% 20%',
              // WebkitFilter:'blur(10px)'
            }}></div>
          <div className="card mb-5 champion-card has-text-white" >
            <div className="card-content">
              <div className="columns is-vcentered">
                <div className="column is-narrow has-text-centered is-centered">
                  <div className="has-text-centered">
                    <ChampionImage size={'64x64'} image={props?.info?.image} />
                    <p className="title has-text-white">
                      {props?.name?.toUpperCase()}
                    </p>
                    <p className="subtitle is-size-6 has-text-white">
                      {props?.info?.title?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="column">
                  <div className="champion-chart-container">
                    <GamesChart victoryData={games} />
                  </div>
                </div>
                <div className="column">
                  <WinrateChart data={winrate} />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}