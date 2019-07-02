import React from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Login from '../front_end/LogIn'
import * as firebase from 'firebase/app'
import Storage from '../back_end/Storage'
import Login_Backend from "./Login_Backend";

import {createMuiTheme} from "@material-ui/core";


const theme = createMuiTheme({
    main: {
        primary: '#2a1547',
        secondary: '#8D00D8',

    }
})


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
        const firebaseConfig = {
            apiKey: "AIzaSyC5Zt3LYjVQV-0VO_cYlZdYoWK90T5Vps8",
            authDomain: "tck-app-a1572.firebaseapp.com",
            databaseURL: "https://tck-app-a1572.firebaseio.com",
            projectId: "tck-app-a1572",
            storageBucket: "tck-app-a1572.appspot.com",
            messagingSenderId: "149043099155",
            appId: "1:149043099155:web:98527958af4bd3a4"
        };
        firebase.initializeApp(firebaseConfig);

        var redirectToLogin = false;

        let s = new Storage();
        let user = s.loadUser();
        let b = new Login_Backend();
        if(user.username === null){
            return(<Router key={"router"}>

                <Redirect to={{
                    pathname: "/login"
                }}/>
                <Route exact={true} path={"/login"} component={Login}/>
                <Route exact={true} path={"/"}/>
            </Router>)


        }else{
            return(<Router key={"router"}>

                <Redirect to={{
                    pathname: "/home"
                }}/>
                <Route exact={true} path={"/login"} component={Login}/>
                <Route exact={true} path={"/"}/>
            </Router>)
        }


    }

}

export default Redirector