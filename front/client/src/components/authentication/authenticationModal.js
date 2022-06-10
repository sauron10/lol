import { useReducer } from "react"
import axios from "axios"

const ACTIONS = {
  'SET_USERNAME': 1,
  'SET_EMAIL': 2,
  'SET_PASSWORD': 3,
  'SET_RE_PASSWORD': 4,
  'SUCCESS' : 5
}

const init = () => ({
  username: '',
  email: '',
  password: '',
  rePassword: '',
  success: false
})

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USERNAME:
      return ({ ...state, username: action.payload })
    case ACTIONS.SET_EMAIL:
      return ({ ...state, email: action.payload })
    case ACTIONS.SET_PASSWORD:
      return ({ ...state, password: action.payload })
    case ACTIONS.SET_RE_PASSWORD:
      return ({ ...state, rePassword: action.payload })
    case ACTIONS.SUCCESS:
      action.payload.setModalOpened(prevMod => !prevMod)
      action.payload.setSuccess(prevSucc => !prevSucc)
      return state

    default:
      return state
  }
}

export const AuthenticationModal = (props) => {
  const [state, dispatch] = useReducer(reducer, {}, init)

  const samePasswords = () => {
    if (state.password === '') return true
    if (state.rePassword === '') return true
    if (state.password === state.rePassword) return true
    return false
  }

  const emailIsFormatted = () => {
    if (state.email === '') return true
    if (state.email.includes(' ')) return false
    const indexA = state.email.indexOf('@')
    if (indexA < 0) return false 
    if (indexA !== state.email.lastIndexOf('@')) return false
    const indexDot = state.email.indexOf('.', indexA)
    return indexDot >= 0 && state.email.length - 1 > indexDot
  }

  const usernameIsFormatted = () => {
    const usernameLst = [...state.username]
    const regexp = /[A-z0-9]/
    for (let c of usernameLst) {
      if (!c.match(regexp)) return false
    }
    return true
  }

  const isOfLength = (str, len) => {
    return str.length <= len
  }

  const formIsOk = () => {
    console.log('Checking is ok')
    for (let key in state) {
      if (state[key] === '') return false
    }
    if (!samePasswords()) return false
    if (!emailIsFormatted()) return false
    if (!usernameIsFormatted()) return false
    if (!isOfLength(state.username, 64)) return false
    if (!isOfLength(state.email, 128)) return false
    if (!isOfLength(state.password, 128)) return false
    if (!isOfLength(state.rePassword, 128)) return false
    return true
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      const res  = await axios.post('https://www.lstats.xyz/api/signup',{
        username : state.username,
        email : state.email,
        password : state.password
      })
      const cookieOpt = {
        expires : 60*60,
        sameSite : 'lax',
        path:'/'
      }
      if(res.data.status === 'ok') dispatch({type:ACTIONS.SUCCESS, payload:{setModalOpened:props.setModalOpened, setSuccess:props.setSuccess}})
      props.setCookie('username', res.data?.username,cookieOpt)
      props.setCookie('authToken', res.data?.token,cookieOpt)
      return res
    }catch(e){
      console.log('Error sending user info')
    }
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.setModalOpened(prevMod => !prevMod)}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-centered">Sign up</p>
          <button className="delete" aria-label="close" onClick={() => props.setModalOpened(prevMod => !prevMod)}></button>
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
              {!usernameIsFormatted() && <p className="alert">Characters can be numbers or letters</p>}
              {!isOfLength(state.username, 64) && <p className="alert">The max length is 64 characters</p>}
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type='email'
                placeholder='@'
                value={state.email}
                onChange={(e) => dispatch({
                  type: ACTIONS.SET_EMAIL,
                  payload: e.target.value
                })}
              />
              {!emailIsFormatted() && <p className="alert">Email must have format xxxxx@xxxx.xxx</p>}
              {!isOfLength(state.email, 128) && <p className="alert">The max length is 128 characters</p>}
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
              {!isOfLength(state.password, 128) && <p className="alert">The max length is 128 characters</p>}
            </div>
            <div className="field">
              <label className="label">Retype password</label>
              <input
                className="input"
                type='password'
                placeholder='Retype Password'
                value={state.rePassword}
                onChange={(e) => dispatch({
                  type: ACTIONS.SET_RE_PASSWORD,
                  payload: e.target.value
                })}
              />
              {!isOfLength(state.rePassword, 128) && <p className="alert">The max length is 128 characters</p>}
              {!samePasswords() && <p className="alert">Passwords don't match</p>}
            </div>
            {formIsOk() && <input className="button is-success" type='submit' value='Save'/>}
            <button className="button" onClick={() => props.setModalOpened(prevMod => !prevMod)}>Cancel</button>
          </form>
        </section>

      </div>
    </div>
  )
}