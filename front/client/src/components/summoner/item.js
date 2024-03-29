export const Item = (props) => {
  return (
    <>
        <figure className="image is-32x32">
          <img
            src={`${process.env.PUBLIC_URL}/img/item/${props.item.image}`}
            alt="Item"
          />
        </figure>
    </>
  );
};
