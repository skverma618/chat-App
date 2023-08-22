import React from "react";
import { Avatar } from "@material-ui/core";
import classes from "./Contact.module.css";
import { useSelector } from "react-redux";

export default function Contact({ contact, click }) {
    const { selectedcontact } = useSelector((state) => {
        return { selectedcontact: state.contacts.selectedcontact };
    });
    const classlist = [classes.Contact];

    if (selectedcontact && selectedcontact._id === contact._id) {
        classlist.push(classes.selected);
    }

    return (
        <div className={classlist.join(" ")} onClick={click}>
            <Avatar src={contact.imgUrl}></Avatar>
            <div className={classes.Contactinfo}>
                <h2>{contact.name == "" ? contact.mobileno : contact.name}</h2>
                <p>last message</p>
            </div>
        </div>
    );
}
