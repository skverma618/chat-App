import React, { useState, useEffect, useRef } from "react";
import classes from "./GroupInfo.module.css";
import { ArrowForward } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "../../../Store/Actions/actionTypes";
import {
    Avatar,
    MenuItem,
    Menu,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
    TextField,
    InputAdornment,
    Tooltip,
    Badge,
    IconButton,
    DialogTitle,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Edit } from "@material-ui/icons";
import {
    removemember,
    makeadmin,
    dismissadmin,
} from "../../../Store/Actions/index";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "../../../axios";
import ImagePreview from "../../Profile/ImagePreview";
import GroupImgPreview from "./GropupImgPreview";

export default function GroupInfo() {
    const { selectedcontact, user, contacts, token } = useSelector((state) => {
        return {
            selectedcontact: state.contacts.selectedcontact,
            user: state.auth.user,
            contacts: state.contacts.contacts,
            token: state.auth.token,
        };
    });
    const [hovered, sethovered] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [opendia, setopendia] = useState("");
    const dispatch = useDispatch();
    const [selectmem, setselecmem] = useState(null);
    const [nameedit, setnameedit] = useState(false);
    const [name, setname] = useState(selectedcontact.name);
    const [nameerror, setnameerror] = useState("");
    const [desedit, setdesedit] = useState(false);
    const [description, setdescription] = useState(selectedcontact.description);
    const [deserror, setdeserror] = useState("");
    const [imgsrc, setimgsrc] = useState("");
    const [imgpre, setimgpre] = useState(false);
    const [imgUrl, setimgUrl] = useState(selectedcontact.imgUrl);
    const [opengrpimg, setopengrpimg] = useState(null);
    const [addparts, setaddparts] = useState(false);
    const [participants, setparticipants] = useState([]);

    useEffect(() => {
        const parts = [];
        for (let i = 0; i < contacts.length; i++) {
            if (contacts[i].type === "contact") {
                let found = false;
                for (let j = 0; j < selectedcontact.members.length; j++) {
                    console.log(
                        // selectedcontact.members[i]._id,
                        contacts[i]._id
                    );
                    if (selectedcontact.members[i]._id === contacts[i]._id) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    parts.push({ ...contacts[i], added: false });
                }
            }
        }
        setparticipants([...parts]);
    }, [selectedcontact]);

    const filepicker = useRef(null);

    useEffect(() => {
        setname(selectedcontact.name);
        setdescription(selectedcontact.description);
        setimgUrl(selectedcontact.imgUrl);
    }, [selectedcontact]);

    const updategroupinfo = (field) => {
        const formdata = new FormData();
        if (token) {
            if (field === "name") {
                console.log("hi");
                if (name === "") {
                    setnameerror("please provide valid name");
                } else {
                    makerequest({
                        field: field,
                        name: name,
                        groupid: selectedcontact._id.toString(),
                    });
                }
            } else if (field === "description") {
                console.log("hi");
                if (description === "") {
                    setdeserror("please provide valid description");
                } else {
                    makerequest({
                        field: field,
                        description: description,
                        groupid: selectedcontact._id.toString(),
                    });
                }
            }
        }
    };

    const imagechangehandler = (event) => {
        const file = event.target.files[0];
        let newurl = null;
        if (file) {
            newurl = URL.createObjectURL(file);
            setimgpre(true);
            setimgsrc(file);
        }
    };

    const saveimghandler = async () => {
        updategroupinfo("image");
        const formdata = new FormData();
        formdata.append("groupid", selectedcontact._id.toString());
        formdata.append("image", imgsrc);
        const response = await axios.post("/group/updateimg", formdata, {
            headers: { authorization: "Bearer " + token },
        });
        dispatch({
            type: actionTypes.UPDATEGROUPINFO,
            data: {
                field: "image",
                imgUrl: response.data.imgUrl,
                id: selectedcontact._id.toString(),
            },
        });
        setimgpre(false);
    };

    const makerequest = async (data) => {
        const field = data.field;
        const response = await axios.post("/group/updatefield", data, {
            headers: { authorization: "Bearer " + token },
        });
        if (field === "name") {
            dispatch({
                type: actionTypes.UPDATEGROUPINFO,
                data: {
                    field: "name",
                    name: name,
                    id: selectedcontact._id.toString(),
                },
            });
            setnameedit(false);
        } else if (field === "description") {
            dispatch({
                type: actionTypes.UPDATEGROUPINFO,
                data: {
                    field: "description",
                    description: description,
                    id: selectedcontact._id.toString(),
                },
            });
            setdesedit(false);
        }
    };

    let userrole = "participant";
    for (let i = 0; i < selectedcontact.members.length; i++) {
        const mem = selectedcontact.members[i];
        if (
            mem.member._id.toString() == user._id.toString() &&
            mem.role == "admin"
        ) {
            userrole = "admin";
        }
    }

    let dialogcontent = null;
    if (opendia == "dismiss") {
        dialogcontent = (
            <DialogContent>
                <DialogContentText>
                    {`do you want to dismiss ${selectmem.name} as admin`}
                </DialogContentText>
                <DialogActions>
                    <Button
                        onClick={() => {
                            dispatch(
                                dismissadmin(
                                    token,
                                    selectedcontact._id,
                                    selectmem._id
                                )
                            );
                            setopendia("");
                        }}
                    >
                        yes
                    </Button>
                    <Button
                        onClick={() => {
                            setopendia("");
                        }}
                    >
                        no
                    </Button>
                </DialogActions>
            </DialogContent>
        );
    } else if (opendia == "make admin") {
        dialogcontent = (
            <DialogContent>
                <DialogContentText>
                    {`do you want to make ${selectmem.name} as admin`}
                </DialogContentText>
                <DialogActions>
                    <Button
                        onClick={() => {
                            dispatch(
                                makeadmin(
                                    token,
                                    selectedcontact._id,
                                    selectmem._id
                                )
                            );
                            setopendia("");
                        }}
                    >
                        yes
                    </Button>
                    <Button
                        onClick={() => {
                            setopendia("");
                        }}
                    >
                        no
                    </Button>
                </DialogActions>
            </DialogContent>
        );
    } else if (opendia == "remove") {
        dialogcontent = (
            <DialogContent>
                <DialogContentText>
                    {`do you want to remove ${selectmem.name} `}
                </DialogContentText>
                <DialogActions>
                    <Button
                        onClick={() => {
                            dispatch(
                                removemember(
                                    token,
                                    selectedcontact._id,
                                    selectmem._id
                                )
                            );
                            setopendia("");
                        }}
                    >
                        yes
                    </Button>
                    <Button
                        onClick={() => {
                            setopendia("");
                        }}
                    >
                        no
                    </Button>
                </DialogActions>
            </DialogContent>
        );
    }

    return (
        <>
            {opengrpimg ? (
                <GroupImgPreview
                    imgurl={opengrpimg}
                    close={() => {
                        setopengrpimg(null);
                    }}
                ></GroupImgPreview>
            ) : null}
            {imgpre ? (
                <ImagePreview
                    imgsrc={URL.createObjectURL(imgsrc)}
                    cancel={() => {
                        setimgUrl(selectedcontact.imgUrl);
                        setimgpre(false);
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
            <Dialog
                open={addparts}
                onClose={() => {
                    setaddparts(false);
                }}
            >
                <DialogTitle sx={{ margi: 0, bgcolor: "green", width: 450 }}>
                    Add Participants
                </DialogTitle>
                <DialogContent sx={{ width: 450, maxHeight: 500 }}>
                    {participants.map((p) => {
                        return (
                            <div className={classes.participant}>
                                <Avatar src={p.imgUrl}></Avatar>
                                <div className={classes.partname}>{p.name}</div>
                            </div>
                        );
                    })}
                </DialogContent>
            </Dialog>
            <Dialog
                open={opendia == "" ? false : true}
                onClose={() => {
                    setopendia("");
                    setselecmem(null);
                }}
            >
                {dialogcontent}
            </Dialog>
            <div className={classes.container}>
                <div className={classes.topsection}>
                    <ArrowForward
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            dispatch({ type: actionTypes.CLOSERDRAWER });
                        }}
                    ></ArrowForward>
                    <p className={classes.text}>group info</p>
                </div>
                <div className={classes.avtarsection}>
                    <div className={classes.avtar}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            badgeContent={
                                userrole === "admin" ? (
                                    <div>
                                        <Tooltip title="click to edit">
                                            <IconButton
                                                onClick={() => {
                                                    filepicker.current.click();
                                                }}
                                            >
                                                <Edit
                                                    style={{
                                                        backgroundColor: "grey",
                                                        padding: "6px",
                                                        borderRadius: "50%",
                                                        color: "white",
                                                        fontSize: "35px",
                                                        cursor: "pointer",
                                                    }}
                                                ></Edit>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                ) : null
                            }
                        >
                            <Avatar
                                onClick={() => {
                                    setopengrpimg(imgUrl);
                                    console.log("opening grp img");
                                }}
                                src={imgUrl}
                                style={{ cursor: "pointer" }}
                                sx={{ height: 200, width: 200 }}
                            ></Avatar>
                        </Badge>
                    </div>
                    <div className={classes.namebox}>
                        {nameedit ? (
                            <TextField
                                type="text"
                                variant="standard"
                                label={
                                    nameerror === "" ? "group name" : "error"
                                }
                                fullWidth={true}
                                className={classes.textfield}
                                value={name}
                                onChange={(e) => {
                                    setname(e.target.value);
                                    setnameerror("");
                                }}
                                autoFocus={nameedit}
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
                                                        setnameedit(false);
                                                        setnameerror("");
                                                        setname(
                                                            selectedcontact.name
                                                        );
                                                    }}
                                                ></ClearIcon>
                                            </Tooltip>
                                            <Tooltip title="click to save">
                                                <CheckIcon
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        updategroupinfo("name");
                                                    }}
                                                ></CheckIcon>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            ></TextField>
                        ) : (
                            <div className={classes.name}>
                                <div>{selectedcontact.name}</div>
                                {userrole === "admin" ? (
                                    <Edit
                                        onClick={() => {
                                            setnameedit(true);
                                        }}
                                        style={{
                                            cursor: "pointer",
                                            marginLeft: "7px",
                                        }}
                                    ></Edit>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
                <div className={classes.description}>
                    <div className={classes.desbox}>
                        <p className={classes.text}>group description</p>
                        {userrole === "admin" ? (
                            <Edit
                                onClick={() => {
                                    setdesedit(true);
                                }}
                                style={{
                                    cursor: "pointer",
                                    marginLeft: "7px",
                                }}
                            ></Edit>
                        ) : null}
                    </div>
                    {desedit ? (
                        <TextField
                            type="text"
                            variant="standard"
                            label={deserror === "" ? "" : "error"}
                            fullWidth={true}
                            className={classes.textfield}
                            value={description}
                            onChange={(e) => {
                                setdescription(e.target.value);
                                setnameerror("");
                            }}
                            autoFocus={desedit}
                            error={deserror === "" ? false : true}
                            helperText={deserror}
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
                                                    setdesedit(false);
                                                    setdeserror("");
                                                    setdescription(
                                                        selectedcontact.description
                                                    );
                                                }}
                                            ></ClearIcon>
                                        </Tooltip>
                                        <Tooltip title="click to save">
                                            <CheckIcon
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    updategroupinfo(
                                                        "description"
                                                    );
                                                }}
                                            ></CheckIcon>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        ></TextField>
                    ) : (
                        <p className={classes.actualdes}>
                            {selectedcontact.description}
                        </p>
                    )}
                </div>
                <div className={classes.members}>
                    <div>
                        <div
                            onClick={() => {
                                setaddparts(true);
                            }}
                            style={{
                                marginLeft: "16px",
                                marginTop: "16px",
                                marginBottom: "10px",
                            }}
                        >
                            Add Participants
                        </div>
                    </div>
                    <div
                        style={{
                            marginLeft: "16px",
                            marginTop: "16px",
                            marginBottom: "10px",
                        }}
                    >
                        participants
                    </div>
                    {selectedcontact.members.map((mem) => {
                        let con = null;
                        if (mem.member._id.toString() === user._id.toString()) {
                            con = { name: "you" };
                        } else {
                            con = contacts.find((c) => {
                                return (
                                    c._id.toString() ===
                                    mem.member._id.toString()
                                );
                            });
                        }
                        const selmem = {
                            name: con ? con.name : mem.member.mobileno,
                            _id: mem.member._id.toString(),
                        };
                        return (
                            <div
                                onMouseLeave={() => {
                                    sethovered(null);
                                    setAnchorEl(null);
                                }}
                                onMouseEnter={() => {
                                    sethovered(mem._id.toString());
                                }}
                                className={classes.member}
                                key={mem._id.toString()}
                            >
                                <Avatar src={mem.member.imgUrl}></Avatar>
                                <div className={classes.meminfo}>
                                    {con ? con.name : mem.member.mobileno}
                                </div>
                                {mem.role == "admin" ? (
                                    <div className={classes.admin}>
                                        Group admin
                                    </div>
                                ) : null}
                                {hovered === mem._id.toString() &&
                                user._id != mem.member._id &&
                                userrole == "admin" ? (
                                    <>
                                        <KeyboardArrowDownIcon
                                            style={{
                                                cursor: "pointer",
                                                marginLeft: "auto",
                                                marginRight: "18px",
                                            }}
                                            onClick={(e) => {
                                                if (!anchorEl) {
                                                    setAnchorEl(
                                                        e.currentTarget
                                                    );
                                                }
                                            }}
                                        ></KeyboardArrowDownIcon>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={() => {
                                                setAnchorEl(null);
                                                sethovered(null);
                                                setselecmem(null);
                                            }}
                                            autoFocus={false}
                                        >
                                            {mem.role === "admin" ? (
                                                <MenuItem
                                                    onClick={() => {
                                                        setopendia("dismiss");
                                                        setAnchorEl(null);
                                                        sethovered(null);
                                                        setselecmem(selmem);
                                                    }}
                                                >
                                                    Dismiss as admin
                                                </MenuItem>
                                            ) : null}
                                            {mem.role != "admin" ? (
                                                <MenuItem
                                                    onClick={() => {
                                                        setopendia(
                                                            "make admin"
                                                        );
                                                        setAnchorEl(null);
                                                        sethovered(null);
                                                        setselecmem(selmem);
                                                    }}
                                                >
                                                    make admin
                                                </MenuItem>
                                            ) : null}
                                            <MenuItem
                                                onClick={() => {
                                                    setopendia("remove");
                                                    setAnchorEl(null);
                                                    sethovered(null);
                                                    setselecmem(selmem);
                                                }}
                                            >
                                                remove
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
