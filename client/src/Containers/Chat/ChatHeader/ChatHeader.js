import React, { useState, useContext, useRef } from "react";
import classes from "./ChatHeader.module.css";
import { Avatar } from "@material-ui/core";
import {
    Call,
    VideocamOutlined,
    Search,
    MoreVert,
    Close,
} from "@material-ui/icons";
import {
    Tooltip,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
    deletecontact,
    clearchat,
    editcontact,
    exitgroup,
    cleargrpchat,
} from "../../../Store/Actions/index";
import * as actionTypes from "../../../Store/Actions/actionTypes";
import { SocketContext } from "../../../Context/socket";

export default function ChatHeader() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [dialog, setdialog] = useState("");
    const [err, seterr] = useState("");
    const [newname, setnewname] = useState("");
    const open = Boolean(anchorEl);
    const { selectedcontact, token } = useSelector((state) => {
        return {
            selectedcontact: state.contacts.selectedcontact,
            token: state.auth.token,
        };
    });
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const handleClose = (d) => {
        setAnchorEl(null);
        setdialog(d);
    };

    let dialogcontent = null;
    if (dialog === "delete contact") {
        dialogcontent = (
            <>
                <DialogContent>
                    <DialogContentText>
                        {`do you want to delete contact`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setdialog("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(deletecontact(selectedcontact._id, token));
                            setdialog("");
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </>
        );
    } else if (dialog === "clear chat") {
        dialogcontent = (
            <>
                <DialogContent>
                    <DialogContentText>{`dp you want to clear chat with ${
                        selectedcontact.name === ""
                            ? selectedcontact.mobileno
                            : selectedcontact.name
                    }, you will not be able to acess previous messages `}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setdialog("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(clearchat(selectedcontact._id, token));
                            setdialog("");
                        }}
                    >
                        Clear For Me
                    </Button>
                </DialogActions>
            </>
        );
    } else if (dialog === "edit contact") {
        dialogcontent = (
            <>
                <DialogContent>
                    <DialogContentText>
                        please provide details
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        label="new name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setnewname(e.target.value);
                        }}
                        onFocus={() => {
                            seterr("");
                        }}
                    />
                    <DialogContentText style={{ color: "red" }}>
                        {err}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setdialog("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (newname === "") {
                                seterr("please provide valid name");
                            } else {
                                dispatch(
                                    editcontact(
                                        selectedcontact._id,
                                        newname,
                                        token
                                    )
                                );
                                setdialog("");
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </>
        );
    } else if (dialog === "exit group") {
        dialogcontent = (
            <DialogContent>
                <DialogContentText>
                    do you really want to exit group
                </DialogContentText>
                <Button
                    onClick={() => {
                        setdialog("");
                    }}
                >
                    No
                </Button>
                <Button
                    onClick={() => {
                        dispatch(
                            exitgroup(token, selectedcontact._id.toString())
                        );
                        setdialog("");
                    }}
                >
                    Yes
                </Button>
            </DialogContent>
        );
    } else if (dialog === "clear grp chat") {
        dialogcontent = (
            <>
                <DialogContent>
                    <DialogContentText>
                        do you really want to clear chat
                    </DialogContentText>
                    <Button
                        onClick={() => {
                            setdialog("");
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => {
                            dispatch(
                                cleargrpchat(
                                    selectedcontact._id.toString(),
                                    token
                                )
                            );
                            setdialog("");
                        }}
                    >
                        Yes
                    </Button>
                </DialogContent>
            </>
        );
    }

    return (
        <div className={classes.chatheader}>
            <Dialog
                onClose={() => {
                    setdialog("");
                }}
                open={dialog === "" ? false : true}
            >
                {dialogcontent}
            </Dialog>
            <div className={classes.infocontainer}>
                <Avatar
                    src={selectedcontact.imgUrl}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        console.log("hi there");
                        if (selectedcontact.type === "contact") {
                            dispatch({
                                type: actionTypes.CHANGERDRAWER,
                                rdrawer: "contact info",
                            });
                        } else {
                            dispatch({
                                type: actionTypes.CHANGERDRAWER,
                                rdrawer: "group info",
                            });
                        }
                    }}
                ></Avatar>
                <div className={classes.info}>
                    <h2>
                        {selectedcontact.name === ""
                            ? selectedcontact.mobileno
                            : selectedcontact.name}
                    </h2>
                </div>
            </div>
            <div className={classes.icons}>
                <Tooltip title="search">
                    <Search
                        style={{ cursor: "pointer", marginRight: "25px" }}
                    ></Search>
                </Tooltip>
                <Tooltip title="menu">
                    <MoreVert
                        style={{ cursor: "pointer", marginRight: "25px" }}
                        onClick={(e) => {
                            if (!anchorEl) {
                                setAnchorEl(e.currentTarget);
                            }
                        }}
                    ></MoreVert>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => {
                        setAnchorEl(null);
                    }}
                    autoFocus={false}
                >
                    {selectedcontact.type === "contact"
                        ? [
                              <MenuItem
                                  key="edit contact"
                                  onClick={() => {
                                      handleClose("edit contact");
                                  }}
                              >
                                  Edit Contact
                              </MenuItem>,
                              <MenuItem
                                  key="delete contact"
                                  onClick={() => {
                                      handleClose("delete contact");
                                  }}
                              >
                                  Delete Contact
                              </MenuItem>,
                              <MenuItem
                                  key="clear chat"
                                  onClick={() => {
                                      handleClose("clear chat");
                                  }}
                              >
                                  Clear Chat
                              </MenuItem>,
                          ]
                        : [
                              <MenuItem
                                  key="exit group"
                                  onClick={() => {
                                      handleClose("exit group");
                                  }}
                              >
                                  Exit Group
                              </MenuItem>,
                              <MenuItem
                                  key="clear grp chat"
                                  onClick={() => {
                                      handleClose("clear grp chat");
                                  }}
                              >
                                  Clear Chat
                              </MenuItem>,
                          ]}
                </Menu>
            </div>
        </div>
    );
}
