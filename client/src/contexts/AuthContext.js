import React from 'react';

const AuthContext = React.createContext({ isAuthorized: false, gapiReady: false });
export default AuthContext;
