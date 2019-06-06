import React from "react";
import Entry from "./Entry";

class Database extends React.Component {


    getAllEntrys(){
        const entries : [Entry] = [];

        //imports
        const firebase = require('firebase');
        const db = firebase.firestore();

        //Getting all docs
        const eventRef = db.collection("Entrys");

        eventRef.get()
            .then(docs => {
                docs.forEach(doc => {
                    console.log(doc.data());
                    entries.push(new Entry(doc.data()["beschreibung"], doc.data()["datum"], doc.data()["datum"], false));
                });
                entries.forEach(entry => {console.log(entry)});
                return entries;
            })
            .catch(error => {
                console.log(error)
            })
    }

}

export default Database