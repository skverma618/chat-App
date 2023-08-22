import * as actionTypes from "../Actions/actionTypes";

const initialState = {
    user: null,
    token: null,
    error: null,
    initialsuccess: false,
    initialload: true,
    socket: null,
};

const authreducer = (state = initialState, action) => {
    if (action.type === actionTypes.REGISTERSUCCESS) {
        return {
            ...state,
            user: action.user,
            token: action.token,
            error: null,
        };
    } else if (action.type === actionTypes.REGISTERFAIL) {
        return {
            ...state,
            user: null,
            error: action.error,
            token: null,
        };
    } else if (action.type === actionTypes.LOGINSUCCESS) {
        return {
            ...state,
            user: action.user,
            token: action.token,
            error: null,
        };
    } else if (action.type === actionTypes.LOGINFAIL) {
        return {
            ...state,
            user: null,
            error: action.error,
            token: null,
        };
    } else if (action.type === actionTypes.GETTOKENSUCCESS) {
        return {
            ...state,
            user: action.user,
            token: action.token,
            error: null,
        };
    } else if (action.type === actionTypes.GETTOKENFAIL) {
        return {
            ...state,
            user: null,
            token: null,
            error: action.error,
        };
    } else if (action.type === actionTypes.INITIALTOKENSUCCESS) {
        return {
            ...state,
            initialsuccess: true,
            initialload: false,
        };
    } else if (action.type === actionTypes.INITIALTOKENFAIL) {
        return {
            ...state,
            initialsuccess: false,
            initialload: false,
        };
    } else if (action.type === actionTypes.UPDATEUSER) {
        return {
            ...state,
            user: action.user,
        };
    }
    return state;
};

export default authreducer;
