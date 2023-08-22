import React from "react";
import { Drawer } from "@mui/material";
import { useSelector } from "react-redux";
import Profile from "../Profile/Profile";
import classes from "./Ldrawer.module.css";
import AddGroup from "../Group/AddGroup/AddGroup";

export default function Ldrawer() {
    const { open, ldrawer } = useSelector((state) => {
        return {
            open: state.dashboard.ldraweropen,
            ldrawer: state.dashboard.ldrawer,
        };
    });

    let el = null;
    if (ldrawer === "profile") {
        el = <Profile></Profile>;
    } else if (ldrawer === "add group") {
        el = <AddGroup></AddGroup>;
    }

    return (
        <div>
            <Drawer
                anchor="left"
                open={open}
                classes={{ paper: classes.drawerpaper }}
                variant="persistent"
            >
                {el}
            </Drawer>
        </div>
    );
}
