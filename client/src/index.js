import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import authReducer from "./Store/Reducers/auth";
import contactsreducer from "./Store/Reducers/Contacts";
import dashboardreducer from "./Store/Reducers/dashboard";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { green, purple } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        primary: {
            main: "#00897b",
        },
        secondary: {
            main: "#4caf50",
        },
    },
});

const composeEnhancers =
    process.env.NODE_ENV === "development"
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : null || compose;

const rootReducer = combineReducers({
    auth: authReducer,
    contacts: contactsreducer,
    dashboard: dashboardreducer,
});

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
    // applyMiddleware(thunk)
);

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
