import React from "react";
import classes from "./ContactsSearch.module.css";
import { SearchOutlined } from "@material-ui/icons";

export default function ContactSearch() {
    return (
        <div className={classes.search}>
            <div className={classes.searchcontainer}>
                <SearchOutlined></SearchOutlined>
                <input placeholder="search or start new chat"></input>
            </div>
        </div>
    );
}
