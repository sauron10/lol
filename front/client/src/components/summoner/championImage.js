export const ChampionImage = (props) => {
  return (
    <figure className={`image ${props.size}`}>
      <img
        className="is-rounded"
        src={`${process.env.PUBLIC_URL}/img/champion/${props.image}`}
        alt="Champion"
      />
    </figure>
  )
}