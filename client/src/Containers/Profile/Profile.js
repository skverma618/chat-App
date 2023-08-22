import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "../../Store/Actions/actionTypes";
import classes from "./Profile.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    Avatar,
    TextField,
    Tooltip,
    InputAdornment,
    IconButton,
    Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "../../axios";
import ImagePreview from "./ImagePreview";

export default function Profile() {
    const dispatch = useDispatch();
    const { user, ldraweropen, token } = useSelector((state) => {
        return {
            user: state.auth.user,
            ldraweropen: state.dashboard.ldraweropen,
            token: state.auth.token,
        };
    });
    const [name, setname] = useState(user.name);
    const [mobileno, setmobileno] = useState(user.mobileno);
    const [imgUrl, setimgUrl] = useState(user.imgUrl);
    const [about, setabout] = useState(user.about);
    const [changename, setchangename] = useState(false);
    const [changeabout, setchangeabout] = useState(false);
    const [changemobileno, setchangemobileno] = useState(false);
    const [nameerror, setnameerror] = useState("");
    const [mobilenoerror, setmobilenoerror] = useState("");
    const [abouterror, setabouterror] = useState("");
    const [imgsrc, setimgsrc] = useState("");
    const [imgpre, setimgpre] = useState(false);

    const filepicker = useRef(null);

    useEffect(() => {
        setchangename(false);
        setchangeabout(false);
        setchangemobileno(false);
    }, [ldraweropen]);

    useEffect(() => {
        setname(user.name);
        setmobileno(user.mobileno);
        setabout(user.about);
        setimgUrl(user.imgUrl);
    }, [user]);

    const imagechangehandler = (event) => {
        const file = event.target.files[0];
        let newurl = null;
        if (file) {
            newurl = URL.createObjectURL(file);
            setimgpre(true);
            setimgsrc(file);
        }
    };

    const cancelimgsave = () => {
        setimgUrl(user.imgUrl);
        setimgpre(false);
    };

    const saveimghandler = async () => {
        if (token) {
            if (imgsrc) {
                const formdata = new FormData();
                formdata.append("image", imgsrc);
                const response = await axios.post(
                    "/profile/updateimg",
                    formdata,
                    {
                        headers: { authorization: "Bearer " + token },
                    }
                );
                dispatch({ type: actionTypes.UPDATEUSER, user: response.data });
                setimgpre(false);
            }
        } else {
            setimgpre(false);
        }
    };

    const makerequest = async (data) => {
        try {
            const field = data.field;
            const response = await axios.post("/profile/updatefield", data, {
                headers: { authorization: "Bearer " + token },
            });
            console.log(response.data);
            if (field === "name") {
                setchangename(false);
                dispatch({ type: actionTypes.UPDATEUSER, user: response.data });
            } else if (field === "about") {
                setchangeabout(false);
                dispatch({ type: actionTypes.UPDATEUSER, user: response.data });
            } else {
                setchangemobileno(false);
                dispatch({ type: actionTypes.UPDATEUSER, user: response.data });
            }
        } catch (error) {
            console.log(error.response.data);
            const field = data.field;
            if (field === "mobileno") {
                setmobilenoerror(error.response.data);
            }
        }
    };

    const updateprofile = (field) => {
        if (token) {
            if (field === "name") {
                console.log("hi");
                if (name === "") {
                    setnameerror("please provide valid name");
                } else {
                    makerequest({ field: field, name: name });
                }
            } else if (field === "about") {
                console.log("jo");
                if (about === "") {
                    setabouterror("please provide valid info");
                } else {
                    makerequest({ field: field, about: about });
                }
            } else if (field === "mobileno") {
                console.log("j2");
                if (
                    mobileno === "" ||
                    mobileno.length < 9 ||
                    mobileno.length > 12
                ) {
                    setmobilenoerror("please provide valid mobileno");
                    console.log(mobileno, "line 93");
                } else {
                    console.log(mobileno);
                    makerequest({ field: field, mobileno: mobileno });
                }
            }
        }
    };

    return (
        <div className={classes.profilecontainer}>
            {imgpre ? (
                <ImagePreview
                    imgsrc={URL.createObjectURL(imgsrc)}
                    cancel={() => {
                        cancelimgsave();
                    }}
                    save={() => {
                        saveimghandler();
                    }}
                    open={imgpre}
                ></ImagePreview>
            ) : null}
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
                        }}
                    ></ArrowBackIcon>
                    <p>profile</p>
                </div>
            </div>
            <div className={classes.avtar}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                        <div>
                            <Tooltip title="click to edit">
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
                        src={imgUrl}
                        sx={{ height: 200, width: 200 }}
                    ></Avatar>
                </Badge>
            </div>
            {!changename ? (
                <div className={classes.info}>
                    <label>your name</label>
                    <div>
                        {user.name}
                        <Tooltip title="click to edit">
                            <EditIcon
                                className={classes.editicon}
                                onClick={() => {
                                    setchangename(true);
                                }}
                            ></EditIcon>
                        </Tooltip>
                    </div>
                </div>
            ) : (
                <div className={classes.input}>
                    <TextField
                        type="text"
                        variant="standard"
                        label={nameerror === "" ? "your name" : "error"}
                        fullWidth={true}
                        className={classes.textfield}
                        value={name}
                        onChange={(e) => {
                            setname(e.target.value);
                            setnameerror("");
                        }}
                        autoFocus={changename}
                        error={nameerror === "" ? false : true}
                        helperText={nameerror}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip title="cancel">
                                        <ClearIcon
                                            style={{
                                                cursor: "pointer",
                                                marginRight: "10px",
                                            }}
                                            onClick={() => {
                                                setchangename(false);
                                                setnameerror("");
                                                setname(user.name);
                                            }}
                                        ></ClearIcon>
                                    </Tooltip>
                                    <Tooltip title="click to save">
                                        <CheckIcon
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                updateprofile("name");
                                            }}
                                        ></CheckIcon>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    ></TextField>
                </div>
            )}
            {!changeabout ? (
                <div className={classes.info}>
                    <label>about</label>
                    <div>
                        {user.about}
                        <Tooltip title="click to edit">
                            <EditIcon
                                className={classes.editicon}
                                onClick={() => {
                                    setchangeabout(true);
                                }}
                            ></EditIcon>
                        </Tooltip>
                    </div>
                </div>
            ) : (
                <div className={classes.input}>
                    <TextField
                        variant="standard"
                        label="your name"
                        fullWidth={true}
                        className={classes.textfield}
                        value={about}
                        type="text"
                        onChange={(e) => {
                            setabout(e.target.value);
                            setabouterror("");
                        }}
                        autoFocus={changeabout}
                        label={abouterror === "" ? "about" : "error"}
                        error={abouterror === "" ? false : true}
                        helperText={abouterror}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip title="cancel">
                                        <ClearIcon
                                            style={{
                                                cursor: "pointer",
                                                marginRight: "10px",
                                            }}
                                            onClick={() => {
                                                setchangeabout(false);
                                                setabouterror("");
                                                setabout(user.about);
                                            }}
                                        ></ClearIcon>
                                    </Tooltip>
                                    <Tooltip title="click to save">
                                        <CheckIcon
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                updateprofile("about");
                                            }}
                                        ></CheckIcon>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    ></TextField>
                </div>
            )}
            {!changemobileno ? (
                <div className={classes.info}>
                    <label>your mobileno</label>
                    <div>
                        {user.mobileno}
                        <Tooltip title="click to edit">
                            <EditIcon
                                className={classes.editicon}
                                onClick={() => {
                                    setchangemobileno(true);
                                }}
                            ></EditIcon>
                        </Tooltip>
                    </div>
                </div>
            ) : (
                <div className={classes.input}>
                    <TextField
                        variant="standard"
                        label="your mobile no"
                        fullWidth={true}
                        className={classes.textfield}
                        value={mobileno}
                        type="tel"
                        onChange={(e) => {
                            setmobileno(e.target.value);
                            setmobilenoerror("");
                        }}
                        autoFocus={changemobileno}
                        label={mobilenoerror === "" ? "your name" : "error"}
                        error={mobilenoerror === "" ? false : true}
                        helperText={mobilenoerror}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Tooltip title="cancel">
                                        <ClearIcon
                                            style={{
                                                cursor: "pointer",
                                                marginRight: "10px",
                                            }}
                                            onClick={() => {
                                                setchangemobileno(false);
                                                setmobilenoerror("");
                                                setmobileno(user.mobileno);
                                            }}
                                        ></ClearIcon>
                                    </Tooltip>
                                    <Tooltip title="click to save">
                                        <CheckIcon
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                updateprofile("mobileno");
                                            }}
                                        ></CheckIcon>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    ></TextField>
                </div>
            )}
        </div>
    );
}
