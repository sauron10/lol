import { DetailsHeader } from "./detailsHeader"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ChampionDetails = (props) => {
  return (
    <>
      <div className="ml-5">
        <FontAwesomeIcon icon={faAngleLeft}
          size={'3x'}
          color={'white'}
          onClick={() => props.dispatch({type:props.ACTIONS.restore})}
        />
      </div>
      {props?.data ? <DetailsHeader champion={props.champion} data={props.data} />:null}
    </>
  )
}