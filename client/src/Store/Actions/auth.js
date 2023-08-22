import axios from "../../axios";
import * as actionTypes from "./actionTypes";

export const userRegister = (data) => {
    return async (dispatch) => {
        try {
            const response = await axios.post("/auth/register", data);
            console.log(response);
            const { token, ...user } = { ...response.data };
            dispatch(checkacesstimeout());
            dispatch({
                type: actionTypes.REGISTERSUCCESS,
                user: user,
                token: token,
            });
            dispatch({ type: actionTypes.INITIALTOKENSUCCESS });
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionTypes.REGISTERFAIL,
                error: error.response.data,
            });
            dispatch({ type: actionTypes.INITIALTOKENFAIL });
        }
    };
};

export const userLogin = (data) => {
    return async (dispatch) => {
        try {
            const response = await axios.post("/auth/login", data);
            console.log(response);
            const { token, ...user } = { ...response.data };
            dispatch(checkacesstimeout());
            dispatch({
                type: actionTypes.LOGINSUCCESS,
                user: user,
                token: token,
            });
            dispatch({ type: actionTypes.INITIALTOKENSUCCESS });
        } catch (error) {
            console.log(error.response.data);
            dispatch({
                type: actionTypes.LOGINFAIL,
                error: error.response.data,
            });
            dispatch({ type: actionTypes.INITIALTOKENFAIL });
        }
    };
};

const checkacesstimeout = () => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(gettoken());
        }, 10 * 60 * 1000);
    };
};

export const gettoken = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/auth/token");
            const { token, ...user } = { ...response.data };
            dispatch(checkacesstimeout());
            dispatch({
                type: actionTypes.GETTOKENSUCCESS,
                user: user,
                token: token,
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionTypes.GETTOKENFAIL,
                error: error.response.data,
            });
        }
    };
};

export const getinitialtoken = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/auth/token");
            const { token, ...user } = { ...response.data };
            dispatch(checkacesstimeout());
            dispatch({
                type: actionTypes.GETTOKENSUCCESS,
                user: user,
                token: token,
            });
            dispatch({ type: actionTypes.INITIALTOKENSUCCESS });
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionTypes.GETTOKENFAIL,
                error: "jwt error",
            });
            dispatch({ type: actionTypes.INITIALTOKENFAIL });
        }
    };
};
