import { useMemo } from "react"
import { useWindowDimensions } from "../../customHooks/window"

const queues = {
  900: 'URF',
  400: 'Normal',
  420: 'Solo',
  440: 'Flex',
  450: 'ARAM',
}

const queuesLst = [420, 400, 900, 440, 450]



export const ChampionFilters = (props) => {
  const { dispatch, ACTIONS, name, isLane } = props
  const { width } = useWindowDimensions()


  return (
    <>
      <div className="container my-5">
        <div className="columns is-centered" style={{maxWidth:width}}>
          <div className="column is-narrow">
            {/* Versions */}
            <div className="control has-text-centered">
              <div className="select">
                <select onChange={e => dispatch({ type: ACTIONS.changeVersion, payload: e.target.value })}>
                  <option label="All" value=''></option>
                  {props?.versions.map((version, index) => <option key={index}>{version}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="control has-text-centered">
              {/* Queue */}
              <div className="select">
                <select onChange={e => dispatch({ type: ACTIONS.changeQueue, payload: e.target.value })}>
                  {queuesLst.map((queue, index) => <option key={index} label={queues[queue]} value={queue}></option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="column is-narrow">
            <div className="control has-text-centered">
              {/* Tier */}
              <div className="select ">
                <select>
                  <option>MASTER+</option>
                  <option>DIAMOND</option>
                  <option>PLATINUM</option>
                  <option>GOLD</option>
                  <option>BRONZE</option>
                  <option>IRON</option>
                </select>
              </div>
            </div>
          </div>
          <div className="column is-narrow">

            <div className="control has-text-centered">
              {/* Position */}
              {isLane && <div className="select">
                <select onChange={e => dispatch({ type: ACTIONS.changeLane, payload: e.target.value })}>
                  <option label="Any" value='ANY'></option>
                  <option label='Top' value='TOP'></option>
                  <option label='Jung' value='JUNGLE'></option>
                  <option label='Mid' value='MIDDLE'></option>
                  <option label='Bot' value='BOTTOM'></option>
                  <option label='Sup' value='UTILITY'></option>
                </select>
              </div>}
            </div>
          </div>
          <div className="column is-narrow">
            <div className="control has-text-centered navbar-input">
              {/* Name */}
              <input
                className="input is-rounded"
                type='text'
                placeholder="Name"
                onChange={e => dispatch({ type: ACTIONS.changeName, payload: e.target.value })}
                value={name}
              ></input>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}