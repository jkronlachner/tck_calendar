import React from "react";

class Storage {
    constructor() {

    }

    avaliable(){
        return (typeof(Storage)==="undefined")
    }

    saveUser(username, password){
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
    }

    loadUser(){
        let username = localStorage.getItem("username");
        let password = localStorage.getItem("password");
        return {"password": password,
                "username": username}

    }



}

export default Storage