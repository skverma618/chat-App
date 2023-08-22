import React, { useState } from "react";
import { useForm } from "react-hook-form";
import classes from "./Register.module.css";
import { useDispatch } from "react-redux";
import { userRegister, userLogin } from "../../Store/Actions/index";

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [formtype, setformtype] = useState("register");
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        if (formtype === "login") {
            const { name, ...newdata } = { ...data };
            dispatch(userLogin(newdata));
        } else {
            dispatch(userRegister(data));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                {formtype === "register" ? (
                    <div>
                        <label>name</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                        ></input>
                    </div>
                ) : null}
                <div>
                    <label>mobile no</label>
                    <input
                        type="tel"
                        {...register("mobileno", { required: true })}
                    ></input>
                </div>
                <div>
                    <label>password</label>
                    <input
                        type="password"
                        {...register("password", { required: true })}
                    ></input>
                </div>
                <button>
                    {formtype === "register" ? "register" : "login"}
                </button>
                {formtype === "register" ? (
                    <p>
                        already registered{" "}
                        <span
                            onClick={() => {
                                setformtype("login");
                            }}
                        >
                            login{" "}
                        </span>
                        here
                    </p>
                ) : (
                    <p>
                        new to chat{" "}
                        <span
                            onClick={() => {
                                setformtype("register");
                            }}
                        >
                            register{" "}
                        </span>
                        here
                    </p>
                )}
            </form>
        </>
    );
}
