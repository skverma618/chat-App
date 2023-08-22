import React from "react";
import { CircularProgress } from "@material-ui/core";
import classes from "./loader.module.css";

export default function loader() {
    return (
        <div className={classes.loader}>
            <CircularProgress></CircularProgress>
        </div>
    );
}
