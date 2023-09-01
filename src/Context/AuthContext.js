import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub=onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });

    return() =>{
        unsub();
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser, // Make sure this is defined in your context
    // Other authentication-related functions...
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
