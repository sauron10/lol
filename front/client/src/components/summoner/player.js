export const Player = (props) => {
  const safeName = (str) => {
    if(str === null) return ''
    return `${str.slice(0, 7)}.`;
  };

  return (
    <>
      <div className="column is-half">
        <div className="columns is-gapless is-mobile">
          <div className="column is-narrow">
            <figure className="image is-16x16">
              <img
                src={`${process.env.PUBLIC_URL}/img/champion/${props.playerPair[0].image}`}
                alt='champion'
              />
            </figure>
          </div>
          <div className="column">
            <p className="has-text-left p-0 has-text-light is-size-7">
              {safeName(props?.playerPair[0]?.current_summoner_name)}
            </p>
          </div>
        </div>
      </div>
      <div className="column is-half">
        <div className="columns is-gapless is-mobile">
          <div className="column is-narrow">
            <figure className="image is-16x16">
              <img
                src={`${process.env.PUBLIC_URL}/img/champion/${props.playerPair[1].image}`}
                alt='champion'
              />
            </figure>
          </div>
          <div className="column is-narrow">
            <p className="has-text-left p-0 has-text-light is-size-7">
              {safeName(props?.playerPair[1]?.current_summoner_name)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
