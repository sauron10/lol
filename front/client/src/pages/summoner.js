import Nav from "../components/nav";
import { useParams } from "react-router-dom";
import SummonerCard from "../components/summoner/summonerCard";
import { useGetSummoner } from "../customHooks/requestSummoner";
import { Achievement } from "../components/summoner/achievementsCard";
import { Match } from "../components/summoner/match";
import { useEffect, useState } from "react";
import { MatchFilter } from "../components/summoner/matchFilter";
import { useWindowDimensions } from "../customHooks/window";
import { MobileSummonerCard } from "../components/summoner/mobileSummonerCard";
import { BestChamps } from "../components/summoner/champs/bestChamps";
// import { useAuthentication } from "../components/authenticationContext";
import { PlayedWith } from "../components/summoner/played/playedWith";

export const Summoner = () => {
  // const authenticated = useAuthentication();
  const [data, updateData, loaded, updateProfileData, getSeasonMatches] = useGetSummoner(
    useParams().summonerName
  );
  // const loadedPage = useRef(false)
  const [index, setIndex] = useState(10);
  const [selectedTab, setSelectedTab] = useState(1);
  const [champion, setChampion] = useState({ activated: false, champion: {} })
  const { width } = useWindowDimensions()

  useEffect(() => {
    updateData(index, selectedTab, champion.champion.id);
    // loadedPage.current = true
  }, [index, updateData, selectedTab, champion])

  useEffect(() => {
    setIndex(() => 10)
  }, [champion])

  const loadMore = () => {
    // console.log(selectedTab);
    setIndex((prevIndex) => prevIndex + 10);

  };

  const updateProfile = () => {
    updateProfileData(selectedTab)
  }

  const isLoaded = loaded;

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
      <div className="columns is-centered ">
        {/* First column */}
        <div className="column is-narrow pl-6 pr-4 mt-5 is-hidden-mobile">
          {isLoaded && <SummonerCard summoner={data} updateProfile={updateProfile} getSeasonMatches={getSeasonMatches} loaded={loaded} />}
          <PlayedWith summoner={useParams().summonerName} queue={selectedTab} />
        </div>
        {width < 500 && isLoaded && <MobileSummonerCard summoner={data} loaded={loaded} />}
        {/* Second column */}
        <div className="column mt-5">
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
            <MatchFilter setSelectedTab={setSelectedTab} selectedTab={selectedTab} setIndex={setIndex} />
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
              <button className="button" onClick={loadMore}>
                {loaded ? 'Load More' : "Loading..."}
              </button>
            </div>
          </div>
        </div>
        {/* Third column */}
        <div className="column is-narrow pr-5">
          <BestChamps summoner={useParams().summonerName}
            champion={champion}
            setChampion={setChampion}
            setSelectedTab={setSelectedTab}
            data={data?.matches} />
        </div>
      </div>
    </>
  );
};

