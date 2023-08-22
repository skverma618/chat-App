import React, { useState } from "react";
import classes from "./Topbar.module.css";
import { Add, MoreHoriz } from "@material-ui/icons";
import { Avatar, Tooltip, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as actiontypes from "../../../Store/Actions/actionTypes";
import AddGroup from "../../Group/AddGroup/AddGroup";

export default function Topbar({ open }) {
    const dispatch = useDispatch();
    const handleClickOpen = () => {
        dispatch({ type: actiontypes.ADDCONTACTOPEN });
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const openmenu = Boolean(anchorEl);
    const [openaddgroup, setopenaddgroup] = useState(false);

    const { user } = useSelector((state) => {
        return { user: state.auth.user };
    });

    return (
        <div className={classes.topbar}>
            <Avatar
                style={{ cursor: "pointer" }}
                onClick={() => {
                    dispatch({
                        type: actiontypes.CHANGELDRAWER,
                        ldrawer: "profile",
                    });
                }}
                src={user.imgUrl}
            ></Avatar>
            <div className={classes.icons}>
                <Tooltip title="new contact">
                    <Add
                        style={{ cursor: "pointer" }}
                        onClick={handleClickOpen}
                    ></Add>
                </Tooltip>
                <Tooltip title="menu">
                    <MoreHoriz
                        onClick={(e) => {
                            if (!anchorEl) {
                                setAnchorEl(e.currentTarget);
                            }
                        }}
                        style={{ cursor: "pointer" }}
                    ></MoreHoriz>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={openmenu}
                    onClose={() => {
                        setAnchorEl(null);
                    }}
                    autoFocus={false}
                >
                    <MenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            dispatch({
                                type: actiontypes.CHANGELDRAWER,
                                ldrawer: "add group",
                            });
                        }}
                    >
                        New Group
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
}
