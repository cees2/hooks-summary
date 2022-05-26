import { createContext, useState } from "react";
import React from "react";

const AuthContext = React.createContext({
  isAuthenticated: false,
  logIn: () => {},
});

export const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logInHandler = () => {
    setIsAuthenticated(true);
  };

  const authContextReturn = {
    isAuthenticated,
    logIn: logInHandler,
  };

  return (
    <AuthContext.Provider value={authContextReturn}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
