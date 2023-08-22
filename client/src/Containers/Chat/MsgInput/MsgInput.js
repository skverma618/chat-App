import React, { useState, useContext, useEffect, useRef } from "react";
import classes from "./MsgInput.module.css";
import {
    EmojiEmotionsOutlined,
    AttachFile,
    MicNoneOutlined,
    SendOutlined,
} from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext } from "../../../Context/socket";
import * as actionTypes from "../../../Store/Actions/actionTypes";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { sendmedia } from "../../../Store/Actions/index";

export default function MsgInput() {
    const [msg, setmsg] = useState("");
    const [rows, setrows] = useState(1);
    const [openpick, setopenpick] = useState(false);
    const socket = useContext(SocketContext);
    const { selectedcontact, user, token } = useSelector((state) => {
        return {
            selectedcontact: state.contacts.selectedcontact,
            user: state.auth.user,
            token: state.auth.token,
        };
    });
    const dispatch = useDispatch();
    const textref = useRef();
    const filepicker = useRef();

    const msgchangehandler = (event) => {
        const minRows = 1;
        const maxRows = 4;
        const textareaLineHeight = 24;
        const previousRows = event.target.rows;
        event.target.rows = minRows;

        const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= maxRows) {
            event.target.rows = maxRows;
            event.target.scrollTop = event.target.scrollHeight;
        }
        const newrows = currentRows < maxRows ? currentRows : maxRows;
        setrows(newrows);
        setmsg(event.target.value);
    };

    const filechangehandler = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const formdata = new FormData();
            formdata.append("senderid", user._id.toString());
            formdata.append("recieverid", selectedcontact._id.toString());
            socket.emit(
                "send-media",
                selectedcontact._id.toString(),
                user._id.toString(),
                user.mobileno,
                file.type,
                (msg) => {
                    formdata.append("msgid", msg._id.toString());
                    formdata.append("media", file);
                    dispatch(sendmedia(token, msg, formdata));
                }
            );
        }
    };

    const sendmsghandler = () => {
        if (msg.length > 0 && selectedcontact.type === "contact") {
            socket.emit(
                "send-message",
                msg,
                selectedcontact._id.toString(),
                user.mobileno,
                user.imgUrl,
                user.about,
                user._id.toString(),
                (message) => {
                    console.log(message);
                    dispatch({
                        type: actionTypes.SENDMESSAGE,
                        msg: message,
                        id: message.recieverid.toString(),
                    });
                }
            );
            setrows(1);
            setopenpick(false);
        } else if (msg.length > 0 && selectedcontact.type === "group") {
            console.log("in here");
            socket.emit(
                "send-group-message",
                msg,
                selectedcontact._id.toString(),
                user._id.toString(),
                user.mobileno,
                (message) => {
                    dispatch({
                        type: actionTypes.SENDMESSAGE,
                        msg: message,
                        id: message.groupid,
                    });
                }
            );
            setrows(1);
            setopenpick(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendmsghandler();
            event.preventDefault();
        }
    };

    useEffect(() => {
        setmsg("");
        setrows(1);
    }, [selectedcontact]);

    return (
        <>
            <div className={classes.inputcontainer}>
                <input
                    ref={filepicker}
                    type="file"
                    capture="environment"
                    onChange={filechangehandler}
                    style={{ display: "none" }}
                    accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
text/plain, application/pdf, image/*, video/*"
                ></input>
                <div className={classes.icons}>
                    {openpick ? (
                        <Picker
                            style={{
                                position: "absolute",
                                zIndex: 1000,
                                width: "800px",
                                bottom: "60px",
                            }}
                            showPreview={false}
                            emoji=""
                            title=""
                            onSelect={(emoji) => {
                                setmsg(msg + emoji.native);
                                textref.current.focus();
                            }}
                        ></Picker>
                    ) : null}
                    <EmojiEmotionsOutlined
                        style={{
                            cursor: "pointer",
                            color: openpick ? "green" : null,
                        }}
                        onClick={() => {
                            setopenpick(!openpick);
                        }}
                    ></EmojiEmotionsOutlined>
                    <AttachFile
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            filepicker.current.click();
                        }}
                    ></AttachFile>
                </div>
                <div className={classes.textsection}>
                    <textarea
                        ref={textref}
                        rows={rows}
                        placeholder="type a message"
                        value={msg}
                        onChange={msgchangehandler}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                </div>
                <div className={classes.micicon}>
                    {msg === "" ? (
                        <MicNoneOutlined
                            style={{ cursor: "pointer" }}
                        ></MicNoneOutlined>
                    ) : (
                        <SendOutlined
                            style={{ cursor: "pointer" }}
                            onClick={sendmsghandler}
                        ></SendOutlined>
                    )}
                </div>
            </div>
        </>
    );
}
