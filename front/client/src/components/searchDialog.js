import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [summonerName, setSummonerName] = useState("");

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    try {
      navigate(`/summoner/${summonerName}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="level">
      <div className="level-item">
        <form onSubmit={handleClick} className='searchbox-form'>
          <div id="searchBoxContainer" className="container">
            <div className="field has-addons has-addons-centered ">
              <div className="control searchbox-control">
                <input
                  className="input is-large is-rounded has-text-centered"
                  type="text"
                  placeholder="Summoner Name"
                  onChange={(e) => setSummonerName(e.target.value)}
                />
              </div>
              <div className="control">
                <input
                  className="button is-primary is-large is-rounded"
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
