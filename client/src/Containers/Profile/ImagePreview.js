import React, { useCallback, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

export default function ImagePreview({ open, imgsrc, cancel, save }) {
    useEffect(() => {
        console.log("hi in preview");
    }, []);

    return (
        <Dialog open={open}>
            <DialogContent>
                <img
                    style={{ width: "500px", height: "281px" }}
                    src={imgsrc}
                ></img>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel}>Cancel</Button>
                <Button onClick={save}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
