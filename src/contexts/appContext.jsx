import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
    return useContext(AppContext);
}

const AppContextProvider = ({ children }) => {
    const [appLoading, setAppLoading] = useState(true);
    const [user, setUser] = useState({ isAuthenticated: false });
    const [favourites, setFavourites] = useState([]);

    // Load favourites for the current user
    useEffect(() => {
        if (user && user.isAuthenticated && user._id) {
            try {
                const stored = localStorage.getItem(`favourites_${user._id}`);
                setFavourites(stored ? JSON.parse(stored) : []);
            } catch {
                setFavourites([]);
            }
        } else {
            setFavourites([]);
        }
    }, [user]);

    // Save favourites for the current user
    useEffect(() => {
        if (user && user.isAuthenticated && user._id) {
            localStorage.setItem(`favourites_${user._id}`, JSON.stringify(favourites));
        }
    }, [favourites, user]);

    const toggleLike = (image) => {
        setFavourites((prev) => {
            if (prev.includes(image._id)) {
                return prev.filter(id => id !== image._id);
            } else {
                return [...prev, image._id];
            }
        });
    };

    const getUserDetails = async () => {
        try {
            setAppLoading(true);
            const resp = await axiosInstance.get("/users");
            if (resp.data.isSuccess) {
                setUser({
                    isAuthenticated: true,
                    ...resp.data.data.user,
                });
            } else {
                ErrorToast("Error in user validation", resp.data.message);
            }
        } catch (err) {
            console.log("------------------ error otherwise");
            ErrorToast("Error in user validation", err.message);
            //todo
        } finally {
            setAppLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const valueObj = {
        appLoading,
        user,
        favourites,
        toggleLike,
    };

    return <AppContext.Provider value={valueObj}>{children}</AppContext.Provider>;
};

export { AppContextProvider };
