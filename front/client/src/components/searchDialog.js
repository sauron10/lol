import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [summonerName,setSummonerName] = useState('')

  const navigate = useNavigate()

  const handleClick = () => {
    // console.log("handle click");
    try{
      // console.log(summonerName)
      navigate(`/summoner/${summonerName}`)
      window.location.reload()
  
    }catch(e){
      console.log(e)
    }
  }
  



  return (

      <div id="searchBoxContainer" className="container">
        <div className="field has-addons">
          <input
            className="input is-half-desktop"
            type="text"
            placeholder="Summoner Name"
            onChange={e => setSummonerName(e.target.value)}
          />
          <a className="button is-primary" onClick={handleClick}>
            Ok
          </a>
        </div>
      </div>

  );
};


export default Search;
