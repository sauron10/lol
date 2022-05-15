export const ImageEmblem = (props) => {
  const toLowupCase = (str) => {
    const li = [...str];
    const rest = [...li];
    rest.shift();
    const restLower = rest.map((x) => x.toLowerCase());
    return [li[0], ...restLower].join("");
  };

  // console.log(toLowupCase(props.emblem))
  return (
    <div className="my-6 has-text-light">
      <div>
        <p className="title is-size-6 has-text-light">
          {props.emblem.queue_type}
        </p>
      </div>
      <div className="image is-96x96 is-inline-block my-2">
        <img
          src={`${process.env.PUBLIC_URL}/ranked-emblems/Emblem_${toLowupCase(
            props.emblem.tier
          )}.png`} alt = "Rank"
        />
      </div>
      <div>
        <p className="mt-2">{`${props.emblem.wins}  /  ${props.emblem.losses}`}</p>
      </div>
    </div>
  );
};
