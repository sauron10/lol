import { useMemo, useState } from "react"
import { ChampionImage } from "../../summoner/championImage"
import { RoleChart } from "./positionChart"
import { WinrateChart } from "./winrateChart"
import { CommonItems } from "../../items/comonItems"
import { LoreCard } from "./loreCard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen, faBook } from "@fortawesome/free-solid-svg-icons"



const safeName = (name) => {
  return name.replace(/[' ]/i, '')
}

// const getRandomSkin = (list) => {
//   // if(list.length < 1) return 0
//   return list[parseInt(Math.random() * (list.length-0))].num
// }

const padPatch = patch => {
  const parts = patch.split('.').slice(0, 2)
  const paddedParts = parts.map(part => part.padStart(2, '0'))
  return paddedParts.join('.')
}

export const ChampionCard = (props) => {
  const [isLore, setIsLore] = useState(false)
  const games = useMemo(() => {
    return props?.lanes?.map((lane, index) => ({ name: index < 3 ? lane.individual_position.slice(0, 3) : '', value: parseInt(lane.games) }))
  }, [props.lanes])

  const winrate = useMemo(() => {
    const winrates = props?.winrates?.map(winrate => ({ name: padPatch(winrate.game_version), value: winrate.wr }))
    return [...winrates].sort((a, b) => a.name - b.name)
  }, [props.winrates])

  return (
    <>
      <div className="columns is-gapless">
        <div className="column is-0 is-1-widescreen is-2-fullhd"></div>
        <div className="column is-centered">
          <div className="container">

            <div className="card" style={
              {
                backgroundImage: `url(${process.env.PUBLIC_URL}/champion/centered/${safeName(props?.info?.name ?? '')}_0.jpg)`,
                backgroundPosition: '25% 20%',
              }}>
            </div>
            <div className="card mb-5 champion-card has-text-white" >
              <div className="card-content p-0">
                <div className="columns is-vcentered">
                  <div className="column is-narrow has-text-centered is-centered ml-3">
                    <div className="has-text-centered">
                      <ChampionImage size={'64x64'} image={props?.info?.image} />
                      <p className="title has-text-white">
                        {props?.name?.toUpperCase()}
                      </p>
                      <p className="subtitle is-size-6 has-text-white">
                        {props?.info?.title?.toUpperCase()}
                      </p>
                      <div className="control has-text-centered my-3">
                        {/* Position */}
                        <div className="select">
                          <select value={props.lane} onChange={e => props.dispatch({ type: 'changeLane', payload: e.target.value })}>
                            <option label="Any" value='%'></option>
                            <option label='Top' value='TOP'></option>
                            <option label='Jung' value='JUNGLE'></option>
                            <option label='Mid' value='MIDDLE'></option>
                            <option label='Bot' value='BOTTOM'></option>
                            <option label='Sup' value='UTILITY'></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column is-centered">
                    <div className="columns is-mobile is-gapless">
                      <div className="column"></div>
                      <div className="column is-narrow">
                        <RoleChart data={games} />
                      </div>
                      <div className="column"></div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="columns is-mobile is-gapless">
                      <div className="column"></div>
                      <div className="column">
                        <WinrateChart data={winrate} />
                      </div>
                      <div className="column"></div>
                    </div>
                  </div>

                </div>
              </div>
              <div onClick={() => setIsLore(prev => !prev)} className="has-text-centered">
                <p className="is-size-4">
                  {!isLore ? <FontAwesomeIcon icon={faBook} /> :
                    <FontAwesomeIcon icon={faBookOpen} />
                  }
                </p>
              </div>
            </div>
          </div>
          <div>
            {isLore ? <LoreCard lore={props?.info.lore} /> : null}
          </div>
        </div>
        <div className="column is-0-touch is-0-desktop is-1-widescreen is-2-fullhd"></div>
      </div>
      <div>
        <CommonItems champion={props.name} />
      </div>
    </>
  )
}