import { ImageEmblem } from "./importImage";
import { getFirstEmblems } from "./functions";
import { useCallback, useEffect, useState } from "react";

const SummonerCard = (props) => {
  const [wastedTime,setWastedTime] = useState(0)
  const [showTime,setShowTime] = useState(false)
  const {getWastedTime} = props
  const safeGetWastedTime = useCallback(() => getWastedTime(),[getWastedTime])

  useEffect(() => async() => {
    setShowTime(false)
    const time = await safeGetWastedTime()
    setWastedTime(time)
  },[safeGetWastedTime])

  const handleClick = async() => {
    setShowTime(prev => !prev)
  }

  const time = (secC) => {
    const zero = n => String(n).padStart(2,'0')
    
    
    const days = Math.floor(secC / (3600 * 24))
    const hrs = Math.floor((secC % (24*60*60)) / 3600)
    const min = Math.floor((secC % 3600) / 60)
    const sec = (secC %  60)

    
    return `${zero(days)}:${zero(hrs)}:${zero(min)}:${zero(sec)}`
  }



  return (
    <div id="summCard" className="container has-text-centered px-2 has-text-white">
      <div className="image is-128x128 is-inline-block mt-5">
        <img
          className="is-rounded"
          src={`${process.env.PUBLIC_URL}/img/profileicon/${props.summoner?.icons[0]?.image}`}
          alt="ProfileIcon"
        />
      </div>
      <p className="title is-size-2 has-text-light my-1">
        {props.summoner.summoner_name}
      </p>
      <button className={props.loaded ? 'button my-3':'button my-3 is-info is-loading'} onClick={props.updateProfile}>Update</button>
      <button className={props.loaded ? 'button my-3':'button my-3 is-info is-loading'} onClick={props.getSeasonMatches}>{props.loaded ? 'Consolidate season' : 'Loading...'}</button>
      <button className='button is-info my-2' onClick={handleClick}> {showTime ? time(wastedTime): 'Time played'} </button>
      <div>
        {props.summoner.leagues && getFirstEmblems(props.summoner.leagues).map((emblem) => 
          <ImageEmblem emblem={emblem} key={`${emblem.date}/${emblem.queue_type}`} />
        )}
      </div>
    </div>
  );
};

export default SummonerCard;
