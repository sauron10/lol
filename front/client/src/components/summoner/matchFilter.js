export const MatchFilter = (props) => {


  const handleClick = (tab) => {
    props.dispatch({type:props.ACTIONS.changeMatchTab,payload:{tab,index:20}})
  }
  
  return (
    <>
      <div className="tabs is-centered m-5">
        <ul>
          <li className={props.state.tab === 1 ? 'is-active':''} onClick={() => handleClick(1)}><a>All</a></li>
          <li className={props.state.tab === 400 ? 'is-active':''} onClick={() => handleClick(400)}><a>Normal</a></li>
          <li className={props.state.tab === 420 ? 'is-active':''} onClick={() => handleClick(420)}><a>Ranked Solo</a></li>
          <li className={props.state.tab === 440 ? 'is-active':''} onClick={() => handleClick(440)}><a>Ranked Flex</a></li>
          <li className={props.state.tab === 450 ? 'is-active':''} onClick={() => handleClick(450)}><a>ARAM</a></li>
        </ul>
      </div>
    </>
  );
};
