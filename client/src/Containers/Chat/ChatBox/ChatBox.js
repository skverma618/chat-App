import React, { useRef, useEffect, useState, useCallback } from "react";
import classes from "./ChatBox.module.css";
import { useSelector, useDispatch } from "react-redux";
import Message from "../Message/Message";
import { fecthmessages } from "../../../Store/Actions/index";

export default function ChatBox() {
    const { selectedcontact, user, token, load, scrollto, contacts } =
        useSelector((state) => {
            return {
                selectedcontact: state.contacts.selectedcontact,
                user: state.auth.user,
                token: state.auth.token,
                load: state.contacts.loadmsgs,
                scrollto: state.contacts.scrollto,
                contacts: state.contacts.contacts,
            };
        });
    const dispatch = useDispatch();
    const msgend = useRef(null);

    useEffect(() => {
        msgend.current.scrollIntoView();
    }, [scrollto]);

    useEffect(() => {
        if (!selectedcontact.msgsfetched) {
            dispatch(
                fecthmessages(
                    user._id,
                    selectedcontact._id,
                    selectedcontact.messages.length,
                    token,
                    selectedcontact.type
                )
            );
        }
    }, [selectedcontact]);

    const observer = useRef();
    const firstmsgref = useCallback(
        (node) => {
            if (load) {
                return;
            }
            if (observer.current) {
                observer.current.disconnect();
            }
            observer.current = new IntersectionObserver((enteries) => {
                if (enteries[0].isIntersecting) {
                    if (
                        selectedcontact.messages.length >= 25 &&
                        selectedcontact.hasmore
                    ) {
                        dispatch(
                            fecthmessages(
                                user._id,
                                selectedcontact._id,
                                selectedcontact.messages.length,
                                token,
                                selectedcontact.type
                            )
                        );
                    }
                    node.scrollIntoView();
                }
            });
            if (node) {
                observer.current.observe(node);
            }
        },
        [load, selectedcontact]
    );

    return (
        <div className={classes.chatBox}>
            {selectedcontact.messages.map((msg, idx) => {
                if (msg.type != "grp info") {
                    let sendername = "";
                    if (
                        selectedcontact.type === "group" &&
                        msg.senderid.toString() != user._id.toString()
                    ) {
                        const con = contacts.find((c) => {
                            return c._id.toString() === msg.senderid.toString();
                        });
                        if (con) {
                            sendername =
                                con.name != "" ? con.name : msg.sendermob;
                        } else {
                            sendername = msg.sendermob;
                        }
                    }
                    if (idx === 0) {
                        return (
                            <Message
                                msg={msg}
                                r={firstmsgref}
                                key={msg._id}
                                sendername={sendername}
                            ></Message>
                        );
                    }
                    return (
                        <Message
                            msg={msg}
                            key={msg._id}
                            sendername={sendername}
                        ></Message>
                    );
                } else {
                    return <Message key={msg._id} msg={msg}></Message>;
                }
            })}
            <div ref={msgend}></div>
        </div>
    );
}
