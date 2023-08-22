import React from "react";
import classes from "./Rdrawer.module.css";
import { Drawer } from "@mui/material";
import { useSelector } from "react-redux";
import GroupInfo from "../Group/GroupInfo/GroupInfo";
import ContactInfo from "../Contacts/ContactInfo/ContactInfo";
import MediaPreview from "../Chat/MediaPreview/MediaPreview";

export default function Rdrawer() {
    const { open, rdrawer } = useSelector((state) => {
        return {
            open: state.dashboard.rdraweropen,
            rdrawer: state.dashboard.rdrawer,
        };
    });

    let el = null;
    if (rdrawer === "group info") {
        el = <GroupInfo></GroupInfo>;
    } else if (rdrawer === "contact info") {
        el = <ContactInfo></ContactInfo>;
    }

    return (
        <div>
            <Drawer
                anchor="right"
                open={open}
                classes={{ paper: classes.drawerpaper }}
            >
                {el}
            </Drawer>
        </div>
    );
}
