export const LoreCard = (props) => {
  return (
    <div className="container p-5 px-6">
      <div className="card p-6 has-text-justified has-text-white">
        <p className="is-size-5">{props.lore}</p>
      </div>
    </div>
  )
}