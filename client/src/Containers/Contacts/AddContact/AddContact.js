import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import * as actiontypes from "../../../Store/Actions/actionTypes";
import { addContact } from "../../../Store/Actions/index";

export default function AddContact() {
    const { token, open, err } = useSelector((state) => {
        return {
            token: state.auth.token,
            open: state.contacts.addcontactopen,
            err: state.contacts.error,
        };
    });
    const [mobileno, setmobileno] = useState("");
    const [name, setname] = useState("");

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch({ type: actiontypes.ADDCONTACTCLOSE });
    };
    const addcontacthandler = () => {
        if (mobileno == "" || mobileno.length < 9 || mobileno.length > 11) {
            dispatch({
                type: actiontypes.ADDCONTACTERROR,
                error: "please provile a vaild mobile no",
            });
        } else if (name == "") {
            dispatch({
                type: actiontypes.ADDCONTACTERROR,
                error: "please provile a vaild name",
            });
        } else {
            if (token) {
                dispatch(addContact(token, mobileno, name));
            }
        }
    };
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>ADD CONTACT</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        to chat please add contact details with whom you want to
                        chat
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        label="mobile no"
                        type="tel"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setmobileno(e.target.value);
                            if (err != "") {
                                dispatch({
                                    type: actiontypes.ADDCONTACTERROR,
                                    error: "",
                                });
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setname(e.target.value);
                            if (err != "") {
                                dispatch({
                                    type: actiontypes.ADDCONTACTERROR,
                                    error: "",
                                });
                            }
                        }}
                    ></TextField>
                    <DialogContentText style={{ color: "red" }}>
                        {err}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addcontacthandler}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
