import Search from '../components/searchDialog';
import Nav from '../components/nav'
import { useAuthentication} from '../components/authenticationContext';



const Home = () => {
  const authenticated = useAuthentication(); 

  return (

    <div>
      <Nav page={'home'}/>
      {authenticated && <Search />}
    </div>
  )
}

export default Home