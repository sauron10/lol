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

const Summoner = () => {
  const [data, updateData, updateQueue,loaded,updateProfileData] = useGetSummoner(
    useParams().summonerName
  );
  const [index, setIndex] = useState(10);
  const [selectedTab, setSelectedTab] = useState(1);
  const { width } = useWindowDimensions()

  useEffect(() => {
    console.log("useEffect ran");
    setIndex(10)
    updateQueue(selectedTab);
  }, [selectedTab, updateQueue]);

  const loadMore = () => {
    console.log(selectedTab);
    updateData(index, selectedTab);
    setIndex((prevIndex) => prevIndex + 10);
  };

  const updateProfile = () => {
    updateProfileData(selectedTab)
  }

  const isLoaded = data !== null;

  const hasMatches = () => data.matches.length > 0;

  console.log(index)
  console.log(loaded)

  return (
    <>
      <Nav />
      <div className="columns is-centered ">
        {/* First column */}
        <div className="column is-narrow pl-6 pr-4 mt-5 is-hidden-mobile">
          {isLoaded && <SummonerCard summoner={data} updateProfile={updateProfile} loaded={loaded} />}
        </div>
        {width < 500 && isLoaded && <MobileSummonerCard  summoner={data} loaded={loaded}/> }
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
            <MatchFilter tab={setSelectedTab} selectedTab={selectedTab} />
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
        <div className="column is-narrow pr-5"></div>
      </div>
    </>
  );
};

export default Summoner;
