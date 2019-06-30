import React from 'react';
import './App.css';
import Entry from "../back_end/Entry"
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'

const resourceMap = [
    {resourceId: 1, resourceTitle: "Platz 1"},
    {resourceId: 2, resourceTitle: "Platz 2"},
    {resourceId: 3, resourceTitle: "Platz 3"},
    {resourceId: 4, resourceTitle: "Platz 4"}
]

function DateCellWrapper({ value, children }){
    const width = "14.28571429%";
    const style = {
        WebkitFlexBasis: width,
        flexBasis: width,
        maxWidth: width,
    };

    return (
        <div style={style}>{children}</div>
    );
}


let components = {
    dayWrapper: DateCellWrapper
}
let formats = {
    dateFormat: 'dd',

    dayFormat: (date, culture, localizer) =>
        localizer.format(date, 'DDD', culture),

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
        localizer.format(start, { date: 'short' }, culture) + ' — ' +
        localizer.format(end, { date: 'short' }, culture),
}

class App extends React.Component{

    firstTime;

  constructor(props) {
    super(props);
    this.state = {
      entries : [],
        firstTime : null
    }

    BigCalendar.momentLocalizer().formats = 'MMMM Do YYYY, h:mm:ss a';
    moment().format();
    moment().locale("de_AT");
  }

  componentWillMount(): void {
    this.getProps()
  }

  getProps(){
    const entries : [Entry] = [];

    //imports
    const firebase = require('firebase');
    const db = firebase.firestore();

    //Getting reference to docs
    const eventRef = db.collection("Entrys");

    //Get all docs
    eventRef.get()
        //Promise resolver
        .then(docs => {
          docs.forEach(doc => {

              if(this.state.firstTime == null){
                  console.log("first time");
                  this.setState({
                      firstTime:  doc.data()["datum"].toDate(),
                  })
              }

              //Get Dates
            var start : Date = doc.data()["datum"].toDate();
            var end = doc.data()["datum"].toDate();
             //Set duration
            end = end.setHours(end.getHours()+ Number(doc.data()["dauer"]));
            end = new Date(end);
             //Create a new event for every court reservated
              console.log("Before")
              console.log(doc.data()["platz"]);
              for (let platz in doc.data()["platz"]) {
                  //Push entries into array
                  console.log("Seas");
                  console.log(doc.data()["platz"]);
                let number = doc.data()["platz"][platz];

                  entries.push(new Entry("Platz " + number , end, start , false, number));
              }



          });

          //Debug Log
          entries.forEach(entry => {console.log(entry)});

          //Set the complete entry set in the state so the site reloads
          this.setState({
            entries: entries
          })
        })
        .catch(error => {
            //If database throws an error, should be given to the user later
          console.log(error)
        })
  }

  customEventPropGetter(event : Object, start: Date, end: Date, isSelected: boolean){

        return{
            className: null,
            style: {
                background: "#00195D",
                color: "white"
            }
        }
  }
    customSlotPropGetter(date: Date){

        return{
            className: null,
            style: {
                backgroundColor: "white",
                flexWidth:"1rem",
                flexBasis:"20px"
            }
        }
    }

    customDayPropGetter(date: Date){
        return{
            className: null,
            style: {
                backgroundColor: "white",
                lineColor:"white",
                flexWidth:"1rem",

            }
        }
    }




    render() {
      let m = moment;
      m.locale("de_AT");
      const localizer = BigCalendar.momentLocalizer(m);
        const minDate = new Date(2019, 8, 1, 6,0,0);
        const maxDate = new Date(2019, 8, 1, 22,0,0);


    return <BigCalendar localizer={localizer}
                        events={this.state.entries}
                        startAccessor="start"
                        endAccessor="end"
                        titleAccessor={"title"}
                        defaultView={BigCalendar.Views.DAY}
                        views={[BigCalendar.Views.WEEK, BigCalendar.Views.DAY]}
                        resources={resourceMap}
                        toolbar={false}
                        step={60}
                        timeslots={1}
                        resourceIdAccessor="resourceId"
                        resourceTitleAccessor="resourceTitle"
                        scrollToTime={this.firstTime}
                        eventPropGetter={this.customEventPropGetter}
                        slotPropGetter={this.customSlotPropGetter}
                        dayPropGetter={this.customDayPropGetter}

                        culture={"de_AT"}
                        formats={formats}

                        min={minDate}
                        max={maxDate}

                        components={components}


    />
  }
}

export default App;

export function segStyle(span, slots){
    let per = (span / slots) * 100 + '%';
    return { WebkitFlexBasis: per, flexBasis: per, maxWidth: per } // IE10/11 need max-width. flex-basis doesn't respect box-sizing
}