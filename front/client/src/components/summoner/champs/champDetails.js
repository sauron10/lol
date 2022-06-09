import { DetailsHeader } from "./detailsHeader"

export const ChampionDetails = (props) => {
  return (
    <>
      <button className="button m-5" onClick={() => props.setChampion(() => ({activated:false,champion:{}}))}>Back</button>
      <DetailsHeader champion={props.champion} data={props.data}/>
    </>
  )
}