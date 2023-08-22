import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Avatar,
    IconButton,
    Badge,
    Tooltip,
    TextField,
    Button,
} from "@mui/material";
import classes from "./AddGroup.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as actionTypes from "../../../Store/Actions/actionTypes";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Close from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { addgroup } from "../../../Store/Actions/index";

export default function AddGroup() {
    const dispatch = useDispatch();
    const { token, contacts } = useSelector((state) => {
        return { token: state.auth.token, contacts: state.contacts.contacts };
    });
    const [selectedcontacts, setselectedcontacts] = useState([]);
    const [selectedstate, setselectedstate] = useState("add contacts");
    const filepicker = useRef(null);
    const [imgsrc, setimgsrc] = useState("");
    const [img, setimg] = useState(null);
    const [description, setdescription] = useState("");
    const [grpname, setgrpname] = useState("");
    const [grpnameerr, setgrpnameerr] = useState("");
    const [descriptionerr, setdescriptionerr] = useState("");
    const [grperr, setgrperr] = useState("");

    const removeselectedcontact = (id) => {
        const newselectedcontacts = [...selectedcontacts];
        const idx = newselectedcontacts.findIndex(
            (c) => c._id.toString() === id
        );
        newselectedcontacts.splice(idx, 1);
        setselectedcontacts(newselectedcontacts);
    };

    const addselectedcontact = (c) => {
        let idx = -1;
        for (let i = 0; i < selectedcontacts.length; i++) {
            if (selectedcontacts[i]._id.toString() === c._id.toString()) {
                idx = i;
            }
        }
        if (idx === -1) {
            setselectedcontacts([...selectedcontacts, c]);
        }
    };

    const imagechangehandler = (event) => {
        const file = event.target.files[0];
        let newurl = null;
        if (file) {
            console.log(file);
            setimg(file);
            setimgsrc(URL.createObjectURL(file));
        }
    };

    const addgrphandler = () => {
        let err = false;
        if (grpname === "") {
            setgrpnameerr("please provide valid name");
            err = true;
        }
        if (description === "") {
            setdescriptionerr("please provide valid description");
            err = true;
        } else if (selectedcontacts.length > 400) {
            err = true;
            setgrperr("maximum 400 particpants allowed");
        }
        if (!err) {
            console.log(grpname, description, imgsrc);
            const formdata = new FormData();
            formdata.append("name", grpname);
            formdata.append("description", description);
            formdata.append("image", img);
            const contacts = selectedcontacts.map((c) => {
                return c._id.toString();
            });
            formdata.append("selectedcontacts", JSON.stringify(contacts));
            if (token) {
                dispatch(addgroup(token, formdata));
            }
        }
    };

    let content = null;
    if (selectedstate === "add contacts") {
        content = (
            <div className={classes.AddGroupContainer}>
                <div className={classes.topsection}>
                    <div>
                        <ArrowBackIcon
                            style={{
                                color: "white",
                                margin: "4px",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                dispatch({
                                    type: actionTypes.CLOSELDRAWER,
                                });
                                setselectedstate("add contacts");
                                setselectedcontacts([]);
                                setimgsrc("");
                                setdescriptionerr("");
                                setdescription("");
                                setgrpname("");
                                setgrpnameerr("");
                                setimg(null);
                            }}
                        ></ArrowBackIcon>
                        <p>Add Group Participants</p>
                    </div>
                </div>
                <div className={classes.selectedcontacts}>
                    {selectedcontacts.map((contact) => {
                        return (
                            <div
                                key={contact._id.toString()}
                                className={classes.selectedcontact}
                            >
                                <Close
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        marginRight: "4px",
                                    }}
                                    onClick={() => {
                                        removeselectedcontact(
                                            contact._id.toString()
                                        );
                                    }}
                                ></Close>
                                <div>
                                    {contact.name == ""
                                        ? contact.mobileno
                                        : contact.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={classes.contactscontainer}>
                    {contacts.map((contact) => {
                        if (contact.type === "contact") {
                            return (
                                <div
                                    key={contact._id.toString()}
                                    className={classes.Contact}
                                    onClick={() => {
                                        addselectedcontact(contact);
                                    }}
                                >
                                    <Avatar src={contact.imgUrl}></Avatar>
                                    <div className={classes.Contactinfo}>
                                        <h2>
                                            {contact.name == ""
                                                ? contact.mobileno
                                                : contact.name}
                                        </h2>
                                        <p>last message</p>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
                {selectedcontacts.length > 0 ? (
                    <div className={classes.forwardcontain}>
                        <IconButton
                            onClick={() => {
                                setselectedstate("add description");
                            }}
                        >
                            <ArrowForwardIcon
                                className={classes.icon}
                                style={{ fontSize: "50px", padding: "8px" }}
                            ></ArrowForwardIcon>
                        </IconButton>
                    </div>
                ) : null}
            </div>
        );
    } else if (selectedstate === "add description") {
        content = (
            <div className={classes.AddGroupInfoContain}>
                <div style={{ color: "red", marginBottom: "12px" }}>
                    {grperr}
                </div>
                <input
                    ref={filepicker}
                    accept="image/*"
                    type="file"
                    capture="environment"
                    onChange={imagechangehandler}
                    style={{ display: "none" }}
                ></input>
                <div className={classes.topsection}>
                    <div>
                        <ArrowBackIcon
                            style={{
                                color: "white",
                                margin: "4px",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                dispatch({
                                    type: actionTypes.CLOSELDRAWER,
                                });
                                setselectedstate("add contacts");
                                setselectedcontacts([]);
                                setimgsrc("");
                                setdescriptionerr("");
                                setdescription("");
                                setgrpname("");
                                setgrpnameerr("");
                                setimg(null);
                            }}
                        ></ArrowBackIcon>
                        <p>Add Group Info</p>
                    </div>
                </div>
                <div className={classes.avtar}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        badgeContent={
                            <div>
                                <Tooltip title="add group icon">
                                    <IconButton
                                        onClick={() => {
                                            filepicker.current.click();
                                        }}
                                    >
                                        <EditIcon
                                            style={{
                                                backgroundColor: "grey",
                                                padding: "6px",
                                                borderRadius: "50%",
                                                color: "white",
                                                fontSize: "35px",
                                                cursor: "pointer",
                                            }}
                                        ></EditIcon>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        }
                    >
                        <Avatar
                            src={imgsrc}
                            sx={{ height: 200, width: 200 }}
                        ></Avatar>
                    </Badge>
                </div>
                <div className={classes.input}>
                    <TextField
                        type="text"
                        variant="standard"
                        value={grpname}
                        label={grpnameerr === "" ? "name" : "error"}
                        onChange={(e) => {
                            setgrpname(e.target.value);
                            setgrpnameerr("");
                        }}
                        fullWidth={true}
                        helperText={grpnameerr}
                        error={grpnameerr === "" ? false : true}
                        onFocus={() => {
                            setgrpnameerr("");
                        }}
                    ></TextField>
                </div>
                <div className={classes.input}>
                    <TextField
                        type="text"
                        variant="standard"
                        label={descriptionerr === "" ? "description" : "error"}
                        value={description}
                        onChange={(e) => {
                            setdescription(e.target.value);
                            setdescriptionerr("");
                        }}
                        fullWidth={true}
                        helperText={descriptionerr}
                        error={descriptionerr === "" ? false : true}
                        onFocus={() => {
                            setdescriptionerr("");
                        }}
                    ></TextField>
                </div>
                <Button
                    variant="contained"
                    style={{ marginTop: "15px" }}
                    onClick={addgrphandler}
                >
                    Add Group
                </Button>
                <div className={classes.backcontain}>
                    <IconButton
                        onClick={() => {
                            setselectedstate("add contacts");
                        }}
                    >
                        <ArrowBackIcon
                            className={classes.icon}
                            style={{ fontSize: "50px", padding: "8px" }}
                        ></ArrowBackIcon>
                    </IconButton>
                </div>
            </div>
        );
    }

    return content;
}
