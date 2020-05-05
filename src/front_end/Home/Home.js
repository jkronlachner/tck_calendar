import React, {useState, useEffect} from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {ArrowForward} from "@material-ui/icons";
import "./Home_Style.css"

function Home() {
    const [today, setToday] = useState(new Date());
    const [data, setData] = useState([]);

    //Gets the data for the first time and also updates on changes
    useEffect(() => {
        const firebase = require('firebase');
        //Firestore ref
        const db = firebase.firestore();
        //Entries ref
        const entries = db.collection('Entrys');


        //Listen for realtime updates
        entries.onSnapshot(snapshot => {
            const results = [];
            const futures = [];
            snapshot.forEach(result => {
                futures.push(result.ref.collection("teilnehmer").get().then(value => {
                    var teilnehmer = [];
                    value.docs.forEach(value1 => {
                        var name = value1.data()["vorname"].charAt(0) + ". " + value1.data()["nachname"];
                        name.trim();
                        teilnehmer.push(name);
                    });
                    var data = result.data();
                    data =  {
                        ...data,
                        "teilnehmer" : teilnehmer
                    };
                    if (!results.includes(data)) {
                        results.push(data)
                    }
                }));
            });
            Promise.all(futures).then(value => {
                console.log(results);
                setData(results);
            });

        })
    }, []);

    //Checks if date is today
    function isToday(dateParameter) {
        return dateParameter.getDate() === today.getDate() && dateParameter.getMonth() === today.getMonth() && dateParameter.getFullYear() === today.getFullYear();
    }

    //Checks if date is tomorrow
    function isTomorrow(dateParameter) {
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return dateParameter.getDate() === tomorrow.getDate() && dateParameter.getMonth() === tomorrow.getMonth() && dateParameter.getFullYear() === tomorrow.getFullYear();
    }

    //Generator Methods wich generate all the custom Labels
    function getDate(column) {
        if (column === 1) {
            return today.toLocaleString('de', {
                month: 'short',
                day: 'numeric',
                weekday: 'long'
            });
        } else {
            //Gets tomorrows date
            let tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            return tomorrow.toLocaleString('de', {
                month: 'short',
                day: 'numeric',
                weekday: 'long'

            });
        }
    }

    function getTime(row) {
        let timeArray = [];
        //Generates an array of time strings
        for (let i = 8; i <= 21; i++) {
            //Appends them into an array and converts them into strings
            timeArray.push(i + ':00')
        }
        //returns the current one
        return timeArray[row]
    }

    //This should fill in the courts which are fullz
    function getCourts(column, row) {
        if (data.length === 0) {
            return
        }
        return data.map(value => {
            //Get admin and if there is none, write none
            let admin = Array.from(value["teilnehmer"]).reduce((previousValue, currentValue) => previousValue + ", " + currentValue);
            if(admin === null){admin = ""}
            //checks if its today or tomoorrow and puts it in the right column
            if (isToday(value["datum"].toDate()) && column === 1) {
                //Checks if time is within
                if (isTimeWithin(value, row+5)) {
                    return <Grid item xs zeroMinWidth>
                        <Paper className={'courtCell'}>
                            <Typography noWrap variant={"body2"}>Platz {value["platz"][0]}</Typography>
                            <Typography noWrap variant={"body2"}>{admin}</Typography>
                        </Paper>
                    </Grid>
                }
            } else if (isTomorrow(value["datum"].toDate()) && column === 2) {
                if (isTimeWithin(value, row+5)) {
                    return <Grid item xs zeroMinWidth>
                        <Paper className={'courtCell'}>
                            <Typography noWrap variant={"body2"}>Platz {value["platz"][0]}</Typography>
                            <Typography noWrap variant={"body2"}>{"\n" + admin}</Typography>
                        </Paper>
                    </Grid>
                }
            }
        });

    }


    //Checks if time is within an entry. also with the duration
    function isTimeWithin(entry, time) {
        const hour = entry["datum"].toDate().getHours() + 1;
        const duration = Number(entry["dauer"]);
        let hours = [];
        for (let i = 0; i < duration; i++) {
            hours.push(hour + i - 1);
        }
        if (hours.includes(time)) {
            return true
        } else {
            return false
        }
    }

    //Generates the upper row, with one empty, and two dates (today and tomorrow)
    function generateDateRow(value) {
        //First one is empty
        if (value === 1) {
            return <Grid key={value} item xs={2} zeroMinWidth/>;
        }
        //All the others are the next two dates
        return <Grid className={'dateLabel'} key={value} item xs={5} zeroMinWidth><Typography
            noWrap>{getDate(value - 1)}</Typography></Grid>
    }

    //This parameter is the row parameter, not the column parameter
    function generateNormalRow(row, column) {
        if (column === 1) {
            //Remove 1 of the row because of the date row
            row -= 1;
            return <Grid className={'timeLabel'} item xs={2} zeroMinWidth
                         key={'date' + row - 1}>{getTime(row - 1)}</Grid>
        }
        row -= 1;
        column -= 1;
        return <Grid className={'courtContainer'} item container xs={5} zeroMinWidth
                     key={column + ' ' + row}>
            {getCourts(column, row)}
        </Grid>
    }

    //This function generates a row, depending wich one it is, it returns either a normal
    //or a date row
    function generateRow(row) {
        //Generates a Row
        if (row === 1) {
            return [1, 2, 3].map(column => {
                //First row is only for date
                return generateDateRow(column)
            });
        } else {
            return [1, 2, 3].map(column => {
                //All others are normal
                return generateNormalRow(row, column);
            });
        }

    }

    //Generates the navigation Bar...
    //Could be outsourced into seperate file
    function navigationBar() {
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return <div className={'navigationBar'}>
            <Fab size={'small'} onClick={event => {
                setToday(new Date(today.setDate(today.getDate() - 2)));
            }}>
                <ArrowBack/>
            </Fab>
            <Button variant={"outlined"} className={'todayButton'} onClick={event => {
                setToday(new Date());
            }}>Heute</Button>
            <Fab size={'small'} onClick={event => {
                setToday(new Date(today.setDate(today.getDate() + 2)));
            }}>
                <ArrowForward/>
            </Fab>
        </div>
    }

    return <Card className={"backgroundSheet"}>
        {console.log("Rerender")}
        {/*This holds the navigation*/}
        {navigationBar()}
        <Grid className={'gridContainer'} container key={today} spacing={3}>
            {/*This maps the rows*/}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(value => {
                return <Grid container item className={'normalRow'} spacing={2} key={value}>
                    {generateRow(value)}
                </Grid>
            })}
        </Grid>
    </Card>

}

export default Home;