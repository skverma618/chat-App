import axios from "../../axios";
import * as actionTypes from "./actionTypes";

export const addgroup = (token, formdata) => {
    return async (dispatch) => {
        try {
            const response = await axios.post("/group/add", formdata, {
                headers: {
                    authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
                },
            });
            response.data.msgsfetched = false;
            response.data.hasmore = true;
            dispatch({ type: actionTypes.ADDGROUP, grp: response.data });
            dispatch({ type: actionTypes.CLOSELDRAWER });
        } catch (error) {
            console.log(error);
        }
    };
};

export const exitgroup = (token, id) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/group/exit",
                { id: id },
                {
                    headers: {
                        authorization: "Bearer " + token,
                    },
                }
            );
            console.log(response);
            dispatch({ type: actionTypes.DELETECONTACT, id: id });
        } catch (error) {
            console.log(error);
        }
    };
};

export const cleargrpchat = (id, token) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/group/clearchat",
                {
                    id: id,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            dispatch({ type: actionTypes.CLEARCHAT, id: id });
        } catch (error) {
            console.log(error);
        }
    };
};

export const removemember = (token, grpid, memid) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/group/remove",
                {
                    grpid: grpid,
                    memid: memid,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
};

export const dismissadmin = (token, grpid, memid) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/group/dismissadmin",
                {
                    grpid: grpid,
                    memid: memid,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
};

export const makeadmin = (token, grpid, memid) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/group/makeadmin",
                {
                    grpid: grpid,
                    memid: memid,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
};
