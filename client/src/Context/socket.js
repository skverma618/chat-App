import io from "socket.io-client";
import React from "react";

export const getsocket = (token) => {
    if (token) {
        return io("http://localhost:8000", {
            auth: { token: token },
        });
    } else {
        return null;
    }
};

export const SocketContext = React.createContext();
