import React, { useContext } from 'react'
import { logInOut } from '../../utils/auth'
import AuthContext from '../../contexts/AuthContext'

const LoginButton = () => {
  const { isAuthorized } = useContext(AuthContext)
  const buttonText = isAuthorized ? 'LOG IN' : 'LOG OUT'
  return <button onClick={logInOut}>{buttonText}</button>
}

export default LoginButton
