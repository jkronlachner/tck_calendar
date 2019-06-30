import React from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Login from '../front_end/LogIn'

class Redirector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return [
            <Router>
                <Redirect to={{
                    pathname: "/login"
                }}/>
                <Route path={"/login"} component={Login}/>
            </Router>

        ]
    }

}

export default Redirector