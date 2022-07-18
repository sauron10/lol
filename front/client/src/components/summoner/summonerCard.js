import { ImageEmblem } from "./importImage";
import {useState} from "react";
import { WRPatchChart } from "./cardCharts.js/winratePatch";

const formatPatch = (patch)=> {
  const patchLst = patch.split('.').slice(0,2)

  return patchLst.map(e => e.padStart(2,'0')).join('.')
}

const formatWinrate = (winrates) => {
  const fWinrates = winrates.map(winrate => ({name:formatPatch(winrate.game_version),wr:winrate.wr}))
  return fWinrates.sort((a,b) => parseFloat(a.name) - parseFloat(b.name))
}

const SummonerCard = (props) => {
  const {time} = props
  const [showTime,setShowTime] = useState(false)
  const [leagues] = props.summoner?.leagues ?? []
    
  const handleClick = async() => {
    setShowTime(prev => !prev)
  }
  
  const timeFormat = (secC) => {
    console.log(secC)
    const zero = n => String(n).padStart(2,'0')
    
    
    const days = Math.floor(secC / (3600 * 24))
    const hrs = Math.floor((secC % (24*60*60)) / 3600)
    const min = Math.floor((secC % 3600) / 60)
    const sec = (secC %  60)

    
    return `${zero(days)}:${zero(hrs)}:${zero(min)}:${zero(sec)}`
  }

  return (
    <div id="summCard" className="container has-text-centered px-2 has-text-white">
      {props.summoner?.icons && <div className="image is-128x128 is-inline-block mt-5">
        <img
          className="is-rounded"
          src={`${process.env.PUBLIC_URL}/img/profileicon/${props.summoner?.icons[0]?.image ?? '1.png'}`}
          alt="ProfileIcon"
        />
      </div>}
      <p className="title is-size-2 has-text-light my-1">
        {props.summoner.summoner_name}
      </p>
      <button className={props.loaded ? 'button my-3':'button my-3 is-info is-loading'} onClick={props.updateProfile}>Update</button>
      <button className={props.loaded ? 'button my-3':'button my-3 is-info is-loading'} onClick={props.getSeasonMatches}>{props.loaded ? 'Consolidate season' : 'Loading...'}</button>
      <button className='button is-info my-2' onClick={handleClick}> {showTime ? timeFormat(time): 'Time played'} </button>
      <div>
        {leagues?.solo && <ImageEmblem emblem={leagues.solo[0]}/>}
        {leagues?.flex && <ImageEmblem emblem={leagues.flex[0]}/>}
      </div>
      <div>
        {props.winrate.length > 0 ? <WRPatchChart data={formatWinrate(props.winrate)} />:null}
      </div>
    </div>
  );
};

export default SummonerCard;
