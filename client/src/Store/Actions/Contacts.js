import axios from "../../axios";
import * as actionTypes from "./actionTypes";
import getvideothumbnail from "../../Utils/getvideothumbnail";
import { saveAs } from "file-saver";
import axios1 from "axios";
import FileDownload from "js-file-download";

export const getContacts = (token) => {
    return async (dispatch) => {
        try {
            const response = await axios.get("/contacts/get", {
                headers: { authorization: "Bearer " + token },
            });
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].msgsfetched = false;
                response.data[i].hasmore = true;
            }
            console.log(response.data);
            dispatch({
                type: actionTypes.GETCONTACTS,
                contacts: response.data,
            });
        } catch (error) {
            console.log(error);
        }
    };
};

export const addContact = (token, mobileno, name) => {
    return async (dispatch) => {
        try {
            dispatch({ type: actionTypes.FETCHMESSAGESSTART });
            const response = await axios.post(
                "/contacts/add",
                {
                    mobileno: mobileno,
                    name: name,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            response.data.msgsfetched = false;
            response.data.hasmore = true;
            dispatch({ type: actionTypes.ADDCONTACTCLOSE });
            dispatch({
                type: actionTypes.ADDCONTACTSUCCESS,
                contact: response.data,
            });
        } catch (error) {
            console.log(error.response.data);
            dispatch({
                type: actionTypes.ADDCONTACTERROR,
                error: error.response.data,
            });
        }
    };
};

export const fecthmessages = (userid, contactid, skip, token, type) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/messages/get",
                {
                    userid: userid,
                    contactid: contactid,
                    skip: skip,
                    type: type,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            dispatch({ type: actionTypes.FETCHMESSAGES, data: response.data });
        } catch (error) {
            console.log(error);
        }
    };
};

export const deletecontact = (contactid, token) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/contacts/delete",
                {
                    id: contactid,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            dispatch({ type: actionTypes.DELETECONTACT, id: contactid });
        } catch (error) {
            console.log(error);
        }
    };
};

export const clearchat = (contactid, token) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/contacts/clearchat",
                {
                    id: contactid,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            dispatch({ type: actionTypes.CLEARCHAT, id: contactid });
        } catch (error) {
            console.log(error);
        }
    };
};

export const editcontact = (id, name, token) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/contacts/edit",
                {
                    id: id,
                    name: name,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            dispatch({ type: actionTypes.EDITCONTACT, name: name, id: id });
        } catch (error) {
            console.log(error);
        }
    };
};

export const deletemessage = (id, token, type) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(
                "/messages/delete",
                {
                    id: id,
                    type: type,
                },
                { headers: { authorization: "Bearer " + token } }
            );
            dispatch({ type: actionTypes.DELETEMESSAGE, id: id });
        } catch (error) {
            console.log(error);
        }
    };
};

export const sendmedia = (token, message, formdata) => {
    return async (dispatch) => {
        const msg = { ...message, progress: 0 };
        console.log(formdata);
        const file = formdata.get("media");
        console.log(file);
        const mediaurl = URL.createObjectURL(file);
        msg.media.url = mediaurl;
        msg.media.name = file.name;
        msg.media.size = Math.round(file.size / (1024 * 1024));
        console.log(mediaurl);
        dispatch({
            type: actionTypes.SENDMEDIASTART,
            msg: msg,
            id: msg.recieverid,
        });
        const response = await axios.post("/messages/sendmedia", formdata, {
            headers: {
                authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (data) => {
                const progress = Math.round((100 * data.loaded) / data.total);
                dispatch({
                    type: actionTypes.MEDIAPROGRESSUPDATE,
                    progress: progress,
                    id: msg.recieverid,
                    msgid: msg._id,
                });
            },
        });
        dispatch({
            type: actionTypes.SENDMEDIASUCCESS,
            id: msg.recieverid,
            msgid: msg._id,
        });
        console.log(response);
    };
};

export const downloadmedia = (token, msg) => {
    return (dispatch) => {
        saveAs(msg.media.url, msg.media.name);
    };
};
