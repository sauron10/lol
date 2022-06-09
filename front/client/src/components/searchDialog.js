import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [summonerName, setSummonerName] = useState("");

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    // console.log("handle click");
    try {
      // console.log(summonerName)
      navigate(`/summoner/${summonerName}`);
      // window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="level">
      <div className="level-item has-text-centered">
        <form onSubmit={handleClick}>
          <div id="searchBoxContainer" className="container">
            <div className="field has-addons is-centered">
              <div className="control">
                <input
                  className="input is-half-desktop"
                  type="text"
                  placeholder="Summoner Name"
                  onChange={(e) => setSummonerName(e.target.value)}
                />
              </div>
              <div className="control">
                <input
                  className="button is-primary is-centered"
                  type="submit"
                  value='Search'
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
