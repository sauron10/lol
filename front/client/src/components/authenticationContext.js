import { useState, useContext, createContext } from "react";

const AuthenticationContext = createContext()
const AuthenticationUpdateContext = createContext()

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}

export const useAuthenticationUpdate = () => {
  return useContext(AuthenticationUpdateContext)
}

export const AuthenticationProvider = ({children}) => {
  
  const [isAuthenticated, setAuthentication] = useState(false)
  
  const toggleAuthentication = () => {
    console.log('toggled')
    setAuthentication(prev => !prev)
  }
  
  return (
    <AuthenticationContext.Provider value = {isAuthenticated} >
      <AuthenticationUpdateContext.Provider value={toggleAuthentication}>
        {children}
      </AuthenticationUpdateContext.Provider>     
    </AuthenticationContext.Provider>
  )
}