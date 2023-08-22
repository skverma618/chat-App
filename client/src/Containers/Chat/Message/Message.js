import React, { useState } from "react";
import classes from "./Message.module.css";
import { useSelector, useDispatch } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    MenuItem,
    Menu,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    CircularProgress,
} from "@mui/material";
import { deletemessage, downloadmedia } from "../../../Store/Actions/index";
import MediaPreview from "../MediaPreview/MediaPreview";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function Message({ msg, r, sendername }) {
    const { user, token, selectedcontact, contacts } = useSelector((state) => {
        return {
            user: state.auth.user,
            token: state.auth.token,
            selectedcontact: state.contacts.selectedcontact,
            contacts: state.contacts.contacts,
        };
    });
    const [hovered, sethovered] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [opendia, setopendia] = useState(false);
    const dispatch = useDispatch();

    const [openmediapre, setopenmediapre] = useState(null);

    const classlist = [classes.textmsg];
    if (user._id === msg.senderid) {
        classlist.push(classes.right);
    } else {
        classlist.push(classes.left);
    }

    const menu = (
        <>
            <KeyboardArrowDownIcon
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                    if (!anchorEl) {
                        setAnchorEl(e.currentTarget);
                    }
                }}
            ></KeyboardArrowDownIcon>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => {
                    setAnchorEl(null);
                    sethovered(null);
                }}
                autoFocus={false}
            >
                <MenuItem
                    onClick={() => {
                        setopendia(true);
                        setAnchorEl(null);
                        sethovered(null);
                    }}
                >
                    Delete Message
                </MenuItem>
            </Menu>
        </>
    );

    let message = null;
    if (msg.type === "grp info") {
        if (msg.infomsg.type === "update description") {
            if (msg.infomsg.doneby === user._id) {
                message = <div>you updated description</div>;
            } else {
                let found = false,
                    name = "";
                for (let i = 0; i < contacts.length; i++) {
                    if (
                        contacts[i].type === "contact" &&
                        contacts[i]._id === msg.infomsg.doneby
                    ) {
                        found = true;
                        name = contacts[i].name;
                    }
                }
                if (found) {
                    message = <div>{name} updated description</div>;
                } else {
                    message = (
                        <div>{msg.infomsg.number} updated description</div>
                    );
                }
            }
        } else if (msg.infomsg.type === "update name") {
            if (msg.infomsg.doneby === user._id) {
                message = <div>you updated name</div>;
            } else {
                let found = false,
                    name = "";
                for (let i = 0; i < contacts.length; i++) {
                    if (
                        contacts[i].type === "contact" &&
                        contacts[i]._id === msg.infomsg.doneby
                    ) {
                        found = true;
                        name = contacts[i].name;
                    }
                }
                if (found) {
                    message = <div>{name} updated name</div>;
                } else {
                    <div>{msg.infomsg.number} updated name</div>;
                }
            }
        } else if (msg.infomsg.type === "update image") {
            if (msg.infomsg.doneby === user._id) {
                message = <div>you updated image</div>;
            } else {
                let found = false,
                    name = "";
                for (let i = 0; i < contacts.length; i++) {
                    if (
                        contacts[i].type === "contact" &&
                        contacts[i]._id === msg.infomsg.doneby
                    ) {
                        found = true;
                        name = contacts[i].name;
                    }
                }
                if (found) {
                    message = <div>{name} updated image</div>;
                } else {
                    <div>{msg.infomsg.number} updated name</div>;
                }
            }
        } else if (
            msg.infomsg.type === "dismiss admin" ||
            msg.infomsg.type === "make admin"
        ) {
            let founddoneto = false,
                namedoneto = "";
            if (msg.infomsg.doneto === user._id) {
                founddoneto = true;
                namedoneto = "you";
            } else {
                for (let i = 0; i < contacts.length; i++) {
                    if (
                        contacts[i].type === "contact" &&
                        contacts[i]._id === msg.infomsg.doneto
                    ) {
                        founddoneto = true;
                        namedoneto = contacts[i].name;
                    }
                }
            }
            let founddoneby = false,
                namedoneby = "";
            if (msg.infomsg.doneby === user._id) {
                founddoneby = true;
                namedoneby = "you";
            } else {
                for (let i = 0; i < contacts.length; i++) {
                    if (
                        contacts[i].type === "contact" &&
                        contacts[i]._id === msg.infomsg.doneby
                    ) {
                        founddoneby = true;
                        namedoneby = contacts[i].name;
                    }
                }
            }
            if (!founddoneby) {
                for (let i = 0; i < selectedcontact.members.length; i++) {
                    if (
                        selectedcontact.members[i].member._id ===
                        msg.infomsg.doneby
                    ) {
                        namedoneby = selectedcontact.members[i].mobileno;
                    }
                }
            }
            if (!founddoneto) {
                for (let i = 0; i < selectedcontact.members.length; i++) {
                    if (
                        selectedcontact.members[i].member._id ===
                        msg.infomsg.doneto
                    ) {
                        namedoneby = selectedcontact.members[i].mobileno;
                    }
                }
            }
            if (msg.infomsg.type === "dismiss admin") {
                message = (
                    <div>
                        {namedoneby} removed {namedoneto} as admin
                    </div>
                );
            } else if (msg.infomsg.type === "make admin") {
                message = (
                    <div>
                        {namedoneby} made {namedoneto} admin
                    </div>
                );
            }
        } else if (msg.infomsg.type === "exit") {
            let found = false,
                name = "";
            for (let i = 0; i < contacts.length; i++) {
                if (
                    contacts[i].type === "contact" &&
                    contacts[i]._id === msg.infomsg.doneby
                ) {
                    found = true;
                    name = contacts[i].name;
                }
            }
            if (!found) {
                for (let i = 0; i < selectedcontact.members.length; i++) {
                    if (
                        selectedcontact.members[i].member._id ===
                        msg.infomsg.doneby
                    ) {
                        name = selectedcontact.members[i].mobileno;
                    }
                }
            }
            message = <div>{name} exited group</div>;
        }
    } else if (msg.type === "text") {
        message = (
            <div
                ref={r}
                className={classlist.join(" ")}
                onMouseLeave={() => {
                    sethovered(null);
                    setAnchorEl(null);
                }}
                onMouseEnter={() => {
                    sethovered(msg._id.toString());
                }}
            >
                {hovered === msg._id.toString() && user._id === msg.senderid
                    ? menu
                    : null}
                <div className={classes.data}>
                    <div className={classes.name}>{sendername}</div>
                    <div className={classes.text}>{msg.data}</div>
                </div>
                {hovered === msg._id.toString() && user._id != msg.senderid
                    ? menu
                    : null}
            </div>
        );
    } else if (msg.type === "media") {
        if (msg.status === "send to server") {
            if (msg.media.type.includes("image")) {
                const classli = [classes.image];
                if (user._id === msg.senderid) {
                    classlist.push(classes.imgright);
                } else {
                    classlist.push(classes.imgleft);
                }
                message = (
                    <img
                        className={classli.join(" ")}
                        src={msg.media.url}
                        onClick={() => {
                            setopenmediapre(msg);
                        }}
                    ></img>
                );
            } else if (msg.media.type.includes("video")) {
                message = (
                    <div className={classes.videorecieved} ref={r}>
                        <div className={classes.videorecievedicon}>
                            <FileDownloadIcon
                                style={{
                                    cursor: "pointer",
                                    fontSize: "50px",
                                    color: "grey",
                                }}
                                onClick={() => {
                                    if (token) {
                                        dispatch(downloadmedia(token, msg));
                                    }
                                }}
                            ></FileDownloadIcon>
                        </div>
                        <div
                            className={classes.videorecievednamebox}
                            onMouseLeave={() => {
                                sethovered(null);
                                setAnchorEl(null);
                            }}
                            onMouseEnter={() => {
                                sethovered(msg._id.toString());
                            }}
                        >
                            <div className={classes.videorecievedname}>
                                {msg.media.name}
                            </div>
                            {hovered === msg._id.toString() &&
                            user._id === msg.senderid
                                ? menu
                                : null}
                            {msg.data}
                            {hovered === msg._id.toString() &&
                            user._id != msg.senderid
                                ? menu
                                : null}
                        </div>
                    </div>
                );
            }
        }
        if (msg.progress === "complete") {
            if (msg.media.type.includes("image")) {
                const classli = [classes.image];
                if (user._id === msg.senderid) {
                    classli.push(classes.imgright);
                } else {
                    classli.push(classes.imgleft);
                }
                message = (
                    <img
                        className={classli.join(" ")}
                        src={msg.media.url}
                        onClick={() => {
                            setopenmediapre(msg);
                        }}
                    ></img>
                );
            } else if (msg.media.type.includes("video")) {
                message = (
                    <div className={classes.videosended} ref={r}>
                        <div className={classes.videosendedback}></div>
                        <div
                            className={classes.videosendednamebox}
                            onMouseLeave={() => {
                                sethovered(null);
                                setAnchorEl(null);
                            }}
                            onMouseEnter={() => {
                                sethovered(msg._id.toString());
                            }}
                        >
                            <div className={classes.videosendedname}>
                                {msg.media.name}
                            </div>
                            {hovered === msg._id.toString() &&
                            user._id === msg.senderid
                                ? menu
                                : null}
                            {msg.data}
                            {hovered === msg._id.toString() &&
                            user._id != msg.senderid
                                ? menu
                                : null}
                        </div>
                    </div>
                );
            }
        } else if (msg.progress) {
            if (msg.media.type.includes("video")) {
                message = (
                    <div className={classes.videosending}>
                        <div className={classes.videosendingprogres}>
                            <CircularProgress
                                value={msg.progress}
                                variant="determinate"
                            ></CircularProgress>
                        </div>
                        <div className={classes.videosendingname}>
                            {msg.media.name}
                        </div>
                    </div>
                );
            }
        }
    }

    return (
        <>
            {openmediapre ? (
                <MediaPreview
                    msg={openmediapre}
                    close={() => {
                        setopenmediapre(null);
                    }}
                ></MediaPreview>
            ) : null}
            <Dialog
                open={opendia}
                onClose={() => {
                    setopendia(false);
                }}
            >
                <DialogContent>
                    <DialogContentText>
                        do you want to delete this message
                    </DialogContentText>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setopendia(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                dispatch(
                                    deletemessage(
                                        msg._id.toString(),
                                        token,
                                        selectedcontact.type
                                    )
                                );
                                setopendia(false);
                            }}
                        >
                            Delete For Me
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            {message}
        </>
    );
}
