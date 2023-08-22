import React from "react";
import {
    Dialog,
    DialogContent,
    Toolbar,
    IconButton,
    Avatar,
} from "@mui/material";
import { Close } from "@material-ui/icons";
import { useSelector } from "react-redux";
import classes from "./MediaPreview.module.css";

export default function MediaPreview({ msg, close }) {
    const { selectedcontact } = useSelector((state) => {
        return { selectedcontact: state.contacts.selectedcontact };
    });

    return (
        <Dialog
            PaperProps={{
                style: {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}
            open={msg ? true : false}
            onClose={close}
            fullScreen
        >
            <div className={classes.topbar}>
                <div className={classes.infocontainer}>
                    <Avatar src={selectedcontact.imgUrl}></Avatar>
                    <div className={classes.info}>
                        <h2>
                            {selectedcontact.name === ""
                                ? selectedcontact.mobileno
                                : selectedcontact.name}
                        </h2>
                    </div>
                </div>
                <div className={classes.icon}>
                    <IconButton edge="end" onClick={close}>
                        <Close></Close>
                    </IconButton>
                </div>
            </div>
            <DialogContent>
                <img
                    style={{
                        maxWidth: "1000px",
                        maxHeight: "600px",
                        width: "auto",
                        height: "auto",
                    }}
                    src={msg.media.url}
                ></img>
            </DialogContent>
        </Dialog>
    );
}
