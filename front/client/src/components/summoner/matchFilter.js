export const MatchFilter = (props) => {

  const handleClick = (tab) => {
    props.setSelectedTab(tab)
    props.setIndex(10)
    props.cleanMatches()
  }
  
  return (
    <>
      <div className="tabs is-centered m-5">
        <ul>
          <li className={props.selectedTab === 1 ? 'is-active':''} onClick={() => handleClick(1)}><a>All</a></li>
          <li className={props.selectedTab === 400 ? 'is-active':''} onClick={() => handleClick(400)}><a>Normal</a></li>
          <li className={props.selectedTab === 420 ? 'is-active':''} onClick={() => handleClick(420)}><a>Ranked Solo</a></li>
          <li className={props.selectedTab === 440 ? 'is-active':''} onClick={() => handleClick(440)}><a>Ranked Flex</a></li>
          <li className={props.selectedTab === 450 ? 'is-active':''} onClick={() => handleClick(450)}><a>ARAM</a></li>
        </ul>
      </div>
    </>
  );
};
