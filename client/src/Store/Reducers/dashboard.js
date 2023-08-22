import * as actiontypes from "../Actions/actionTypes";

const initialState = {
    ldrawer: "contacts",
    ldraweropen: false,
    rdraweropen: false,
    rdrawer: "contacts",
};

const dashboardreducer = (state = initialState, action) => {
    if (action.type === actiontypes.CHANGELDRAWER) {
        return { ...state, ldrawer: action.ldrawer, ldraweropen: true };
    } else if (action.type === actiontypes.CLOSELDRAWER) {
        return { ...state, ldraweropen: false };
    } else if (action.type === actiontypes.CLOSERDRAWER) {
        return { ...state, rdraweropen: false };
    } else if (action.type === actiontypes.CHANGERDRAWER) {
        return { ...state, rdrawer: action.rdrawer, rdraweropen: true };
    }
    return state;
};

export default dashboardreducer;
