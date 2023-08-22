import "./App.css";
import react, { useEffect } from "react";
import Register from "./Containers/Auth/Register";
import { getinitialtoken } from "./Store/Actions/index";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./Containers/Dashboard/Dashboard";
import { Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Loader from "./Containers/UI/loader";

function App() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { user, token, initialsuccess, initialload } = useSelector(
        (state) => {
            return {
                user: state.auth.user,
                token: state.auth.token,
                initialsuccess: state.auth.initialsuccess,
                initialload: state.auth.initialload,
            };
        }
    );

    useEffect(() => {
        dispatch(getinitialtoken());
    }, []);

    let content = null;
    if (!initialload) {
        if (initialsuccess) {
            content = <Route path="/" component={Dashboard}></Route>;
        } else {
            content = <Route path="/" component={Register}></Route>;
        }
    } else {
        content = <Route path="/" component={Loader}></Route>;
    }

    return <div className="App">{content}</div>;
}

export default App;
