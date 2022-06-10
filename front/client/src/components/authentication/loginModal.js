import { useReducer } from "react"
import axios from "axios"

const ACTIONS = {
  SET_USERNAME: 1,
  SET_PASSWORD: 2,
  LOGIN: 3,
  LOGIN_ERROR:4
}

const init = () => {
  return ({
    username: '',
    password: '',
  })
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USERNAME:
      return ({ ...state, username: action.payload })
    case ACTIONS.SET_PASSWORD:
      return ({ ...state, password: action.payload })
    case ACTIONS.LOGIN:
      return
    case ACTIONS.LOGIN_ERROR:
      return ({...state,error:action.payload})
    default:
      return state
  }
}



export const LoginModal = (props) => {
  const [state, dispatch] = useReducer(reducer, {}, init)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('https://www.lstats.xyz/api/signin/', {
        username: state.username,
        password: state.password
      })
      const cookieOpt = {
        expires: 60 * 60,
        sameSite: 'lax',
        path: '/'
      }
      console.log(res)
      if (res.data.status === 200) {
        props.setLoginOpened(prevLog => !prevLog)
        props.setCookie('username', res.data?.username, cookieOpt)
        props.setCookie('authToken', res.data?.token, cookieOpt)
        props.toggleAuthentication()
      }else{
        dispatch({type:ACTIONS.LOGIN_ERROR, payload:res.data.e})
      }
    } catch (e) {
      console.log('Error sending user info: ', e)
    }
  }

  const formIsOk = () => {
    return state.username !== '' && state.password !== ''
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.setLoginOpened(prevLog => !prevLog)}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-centered">Sign in</p>
          <button className="delete" aria-label="close" onClick={() => props.setLoginOpened(prevLog => !prevLog)}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <input
                className="input"
                type='text'
                placeholder='Username'
                value={state.username}
                onChange={(e) => dispatch({
                  type: ACTIONS.SET_USERNAME,
                  payload: e.target.value
                })}
              />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <input
                className="input"
                type='password'
                placeholder='Password'
                value={state.password}
                onChange={(e) => dispatch({
                  type: ACTIONS.SET_PASSWORD,
                  payload: e.target.value
                })}
              />
            </div>
            <p className="alert"> {state.error} </p>
            {formIsOk() && <input className="button is-success" type='submit' value='Save' />}
            <button className="button" onClick={() => props.setLoginOpened(prevLog => !prevLog)}>Cancel</button>
          </form>
          
        </section>

      </div>
    </div>
  )
}