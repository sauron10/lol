import { useAuthentication } from "../components/authenticationContext";
import {Summoner} from './summoner'
import { AuthenticateComp } from "../components/authentication/authenticate";

export const Auth = () => {
  const authenticated = useAuthentication()

  return (
    <>    
    {authenticated ? <Summoner/> : <AuthenticateComp/>}
    </>
  )
}