import React from "react";

const AuthContext = React.createContext({
  isAuthorized: false,
  gapiReady: false,
  setAuth: () => {}
});
export default AuthContext;
