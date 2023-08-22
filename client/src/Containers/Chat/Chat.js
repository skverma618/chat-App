import React from "react";
import ChatHeader from "./ChatHeader/ChatHeader";
import classes from "./Chat.module.css";
import ChatBox from "./ChatBox/ChatBox";
import MsgInput from "./MsgInput/MsgInput";
import { useSelector } from "react-redux";

export default function Chat() {
    const { selectedcontact } = useSelector((state) => {
        return { selectedcontact: state.contacts.selectedcontact };
    });

    let content = <div></div>;
    if (selectedcontact) {
        content = (
            <div className={classes.chat}>
                <ChatHeader></ChatHeader>
                <ChatBox></ChatBox>
                <MsgInput></MsgInput>
            </div>
        );
    }

    return content;
}
