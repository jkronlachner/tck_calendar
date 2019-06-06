import React from "react";

class Entry  {
     title: String;
     end: Date;
     start: Date;
     allDay: Boolean;
     resourceId;




    constructor(name, end, start, fullDay, platz) {
        this.title = name;
        this.end = end;
        this.start = start;
        this.allDay = fullDay;
        this.resourceId = platz;

    }







}

export default Entry;