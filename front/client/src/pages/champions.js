import Nav from '../components/nav'
import { ChampionsList } from '../components/champions/championList'

const Champions = () => {
  // const authenticated = useAuthentication()

  return (
    <>
      <Nav page={'champions'} />
      <div>
        <ChampionsList/>
      </div>
    </>
  )
}

export default Champions