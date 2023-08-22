import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Contacts from "../Contacts/Contacts";
import Chat from "../Chat/Chat";
import classes from "./Dashboard.module.css";
import Ldrawer from "../Ldrawer/Ldrawer";
import Rdrawer from "../Rdrawer/Rdrawer";
import io from "socket.io-client";
import * as actionTypes from "../../Store/Actions/actionTypes";
import { SocketContext, getsocket } from "../../Context/socket";

export default function Dashboard() {
    const { token, user } = useSelector((state) => {
        return { token: state.auth.token, user: state.auth.user };
    });
    const [socket, setsocket] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setsocket(getsocket(token));
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("recieve-message", (msg) => {
                dispatch({ type: actionTypes.RECIEVEMESSAGE, msg: msg });
            });
            socket.on("recieve-media", (msg) => {
                dispatch({ type: actionTypes.RECIEVEMEDIA, msg: msg });
            });
            socket.on("add-group", (grp) => {
                console.log("in add grp soc");
                dispatch({ type: actionTypes.ADDGROUP, grp: grp });
            });
            socket.on("update-group-info", (data) => {
                dispatch({ type: actionTypes.UPDATEGROUPINFO, data: data });
            });
            socket.on("recieve-group-message", (msg) => {
                if (msg.type === "grp info") {
                    if (msg.infomsg.type === "exit") {
                        dispatch({
                            type: actionTypes.REMOVEGRPMEMBER,
                            member: msg.infomsg.doneby,
                            groupid: msg.groupid,
                        });
                    } else if (msg.infomsg.type === "dismiss admin") {
                        dispatch({
                            type: actionTypes.DISMISSADMIN,
                            groupid: msg.groupid,
                            member: msg.infomsg.doneto,
                        });
                    } else if (msg.infomsg.type === "make admin") {
                        dispatch({
                            type: actionTypes.MAKEADMIN,
                            groupid: msg.groupid,
                            member: msg.infomsg.doneto,
                        });
                    }
                }
                dispatch({ type: actionTypes.RECIEVEGRPMESSAGE, msg: msg });
            });
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            <div className={classes.dashboard}>
                <div className={classes.title}>kunal chat</div>
                <div className={classes.container}>
                    <Rdrawer></Rdrawer>
                    <Ldrawer></Ldrawer>
                    <Contacts></Contacts>
                    <Chat></Chat>
                </div>
            </div>
        </SocketContext.Provider>
    );
}
