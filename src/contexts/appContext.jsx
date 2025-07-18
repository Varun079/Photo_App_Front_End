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
    const [favourites, setFavourites] = useState(() => {
        try {
            const stored = localStorage.getItem('favourites');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
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

    useEffect(() => {
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }, [favourites]);

    const valueObj = {
        appLoading,
        user,
        favourites,
        toggleLike,
    };

    return <AppContext.Provider value={valueObj}>{children}</AppContext.Provider>;
};

export { AppContextProvider };
