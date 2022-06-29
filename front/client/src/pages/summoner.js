import Nav from "../components/nav";
import { useParams } from "react-router-dom";
import SummonerCard from "../components/summoner/summonerCard";
import { useGetSummoner } from "../customHooks/requestSummoner";
import { Achievement } from "../components/summoner/achievementsCard";
import { Match } from "../components/summoner/match";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MatchFilter } from "../components/summoner/matchFilter";
import { useWindowDimensions } from "../customHooks/window";
import { MobileSummonerCard } from "../components/summoner/mobileSummonerCard";
import { BestChamps } from "../components/summoner/champs/bestChamps";
// import { useAuthentication } from "../components/authenticationContext";
import { PlayedWith } from "../components/summoner/played/playedWith";

export const Summoner = (props) => {
  // const authenticated = useAuthentication();
  const [data, updateData, loaded, updateProfileData, getSeasonMatches, cleanMatches, getWastedTime] = useGetSummoner(
    useParams().summonerName
  );
  // const loadedPage = useRef(false)
  const [index, setIndex] = useState(10);
  const [selectedTab, setSelectedTab] = useState(1);
  const [champion, setChampion] = useState({ activated: false, champion: {} })
  const { width } = useWindowDimensions()
  const {summoner} = props.summoner()
  const matchList = useMemo(() => data?.matches?.map(match => match?.match_id) ?? [],[data])



  useEffect(() => {
    setIndex(() => 10)
  }, [champion, selectedTab, data?.summoner_name])

  useEffect(() => {
    // const matchList = data?.matches?.map(match => match?.match_id) ?? []

    updateData(index, selectedTab, champion.champion.id, matchList);
  }, [index, updateData, selectedTab, champion])

  const loadMore = () => {
    // console.log(selectedTab);
    setIndex((prevIndex) => prevIndex + 10);

  };

  const updateProfile = () => {
    updateProfileData(selectedTab)
  }

  const isLoaded = data !== null;

  const hasMatches = () => {
    if (data.matches) {
      return data.matches.length > 0
    }
    return false
  }

  // console.log(index)

  return (
    <>
      <Nav page={'summoner'} />
      <div className='columns is-centered ' style={{ maxWidth: width }}>
        {/* First column */}
        <div className="column is-narrow p-0 m-5">
          {isLoaded && <SummonerCard summoner={data} updateProfile={updateProfile} getSeasonMatches={getSeasonMatches} loaded={loaded} getWastedTime={getWastedTime} />}
          <PlayedWith summoner={useParams().summonerName} queue={selectedTab} />
        </div>
        {/* {width < 500 && isLoaded && <MobileSummonerCard summoner={data} loaded={loaded} />} */}
        {/* Second column */}
        <div className="column p-0 m-5">
          <div className="px-6">
            <div className="columns">
              <div className="column">
                {isLoaded && <Achievement summoner={data} />}
              </div>
              <div className="column">
                {isLoaded && <Achievement summoner={data} />}
              </div>
              <div className="column">
                {isLoaded && <Achievement summoner={data} />}
              </div>
            </div>
          </div>
          {isLoaded && (
            <MatchFilter setSelectedTab={setSelectedTab} selectedTab={selectedTab} setIndex={setIndex} cleanMatches={cleanMatches} />
          )}

            {isLoaded &&
              hasMatches() &&
              data.matches.map((match) => (
                <Match
                  summoner={match}
                  key={`${match.match_id}`}
                  position={width}
                  loaded={loaded}
                />
              ))}

          <div className="level">
            <div className="level-item">
              <button className={loaded ? 'button my-3' : 'button my-3 is-info is-loading'} onClick={loadMore}>
                Load More
              </button>
            </div>
          </div>
        </div>
        {/* Third column */}
        {(width > 1100 || width < 770) && <div className="column is-narrow p-0 m-5">
          <BestChamps summoner={summoner}
            champion={champion}
            setChampion={setChampion}
            setSelectedTab={setSelectedTab}
            data={data?.matches}
            cleanMatches={cleanMatches} />
        </div>}
      </div>
    </>
  );
};

