import React, { useState, useEffect } from "react";
import classes from "./Contacts.module.css";
import Topbar from "./Topbar/Topbar";
import ContactsSearch from "./ContactsSearch/ContactSearch";
import Contact from "./Contact/Contact";
import AddContact from "./AddContact/AddContact";
import { useDispatch, useSelector } from "react-redux";
import { getContacts } from "../../Store/Actions/index";
import * as actionTypes from "../../Store/Actions/actionTypes";

export default function Contacts() {
    const { token, contacts } = useSelector((state) => {
        return { token: state.auth.token, contacts: state.contacts.contacts };
    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getContacts(token));
    }, []);

    return (
        <div className={classes.contactscontainer}>
            <AddContact></AddContact>
            <Topbar></Topbar>
            <ContactsSearch></ContactsSearch>
            <div className={classes.contacts}>
                {contacts.map((contact) => {
                    return (
                        <Contact
                            click={() => {
                                dispatch({
                                    type: actionTypes.SELECTCONTACT,
                                    _id: contact._id,
                                });
                            }}
                            key={contact._id.toString()}
                            contact={contact}
                        ></Contact>
                    );
                })}
            </div>
        </div>
    );
}
