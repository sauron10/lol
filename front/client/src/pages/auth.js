import { useAuthentication } from "../components/authenticationContext";
import { Summoner } from './summoner'
import { AuthenticateComp } from "../components/authentication/authenticate";
import Champions from "./champions";

export const Auth = (props) => {
  const authenticated = useAuthentication()

  const routePage = () => {
    if(!authenticated) return <AuthenticateComp/>
    switch (props.page){
      case 'summoner':
        return <Summoner summoner={props.summoner}/>
      case 'champions':
        return <Champions/>
      default:
        return 
    }
  }

  return (
    <>
      {routePage()}
    </>
  )
}