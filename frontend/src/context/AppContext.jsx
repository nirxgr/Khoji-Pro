import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");

      if (data.success) {
        setIsLoggedin(true);
        setUserData(data.userData);
      } else {
        // Not authorized or no user data
        setUserData(false);
        setIsLoggedin(false);
      }
    } catch (error) {
      setUserData(false);
      setIsLoggedin(false);
      toast.error(error.message || "Failed to fetch user data");
    } finally {
      setAuthReady(true);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {}, [isLoggedin]);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    authReady,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
