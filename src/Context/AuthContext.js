import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub=onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return() =>{
        unsub();
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
