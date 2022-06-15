import { useState, useContext, createContext } from "react";

const AuthenticationContext = createContext()
const AuthenticationUpdateContext = createContext()
const CredentialsContext = createContext()
const CredentialsContextUpdate = createContext()

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}

export const useAuthenticationUpdate = () => {
  return useContext(AuthenticationUpdateContext)
}

export const useCredentials = () => {
  return useContext(CredentialsContext)
}

export const useCredentialsUpdate = () => {
  return useContext(CredentialsContextUpdate)
}

export const AuthenticationProvider = ({ children }) => {

  const [isAuthenticated, setAuthentication] = useState(false)
  const [credentials, setCredentials] = useState({})

  const toggleAuthentication = () => {
    setAuthentication(prev => !prev)
  }

  const changeCredentials = (username, token) => {
    setCredentials({ username, token })
  }

  return (
    <AuthenticationContext.Provider value={isAuthenticated} >
      <AuthenticationUpdateContext.Provider value={toggleAuthentication}>
        <CredentialsContext.Provider value={credentials}>
          <CredentialsContextUpdate.Provider value={changeCredentials}>
            {children}
          </CredentialsContextUpdate.Provider>
        </CredentialsContext.Provider>
      </AuthenticationUpdateContext.Provider>
    </AuthenticationContext.Provider>
  )
}