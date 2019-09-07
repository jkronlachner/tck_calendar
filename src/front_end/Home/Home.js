import React, {useState, useEffect} from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import {ArrowBack} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {ArrowForward} from "@material-ui/icons";

function Home() {
    const [today, setToday] = useState(new Date());
    const [data, setData] = useState([]);
    const [currentData, setCurrentData] = useState([]);

    useEffect(() => {
        const firebase = require('firebase');
        //Firestore ref
        const db = firebase.firestore();
        //Entries ref
        const entries = db.collection('Entrys');


        //Listen for realtime updates
        entries.onSnapshot(snapshot => {
            const results = [];
            snapshot.forEach(result => {
                if (!results.includes(result.data())) {
                    results.push(result.data())
                }
            });
            setData(results);
        })
    }, []);

    //Listens for data changes
    useEffect(() => {
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        //Current data as array
        const current = [];

        data.forEach(value => {

            let date = value["datum"].toDate();
            if (isToday(date) || isTomorrow(date)) {
                console.log(date, 'Is Today or Tomorrow');
                //Push a date in our array if it is tomorrow or today
                current.push(value);
            }
        });
        //set the current array as state
        setCurrentData(current);
    }, [data]);

    //Checks if date is today
    function isToday(dateParameter) {
        var today = new Date();
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
                day: 'numeric'
            });
        } else {
            //Gets tomorrows date
            let tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            return tomorrow.toLocaleString('de', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    function getTime(row) {
        let timeArray = [];
        //Generates an array of time strings
        for (let i = 6; i <= 21; i++) {
            //Appends them into an array and converts them into strings
            timeArray.push(i + ':00')
        }
        //returns the current one
        return timeArray[row]
    }

    //This should fill in the courts which are full
    function getCourts(column, row) {
        if (currentData.length === 0) {
            return
        }
        return currentData.map(value => {
            //checks if its today or tomoorrow and puts it in the right column
            if (isToday(value["datum"].toDate()) && column === 1) {
                //Checks if time is within
                if (isTimeWithin(value, row+5)) {
                    console.log("returns");
                    return <Grid item xs zeroMinWidth>
                            <Paper className={'courtCell'}>
                                <Typography noWrap variant={"body2"}>Platz {value["platz"][0]}</Typography>
                                <Typography noWrap variant={"body2"}>Kronlachner</Typography>
                            </Paper>
                        </Grid>
                }
            } else if (isTomorrow(value["datum"].toDate()) && column === 2) {
                console.log(value, 'is tomorrow');
                if (isTimeWithin(value, row+5)) {
                    console.log("returns");
                    return <Grid item xs zeroMinWidth>
                            <Paper className={'courtCell'}>
                                <Typography noWrap variant={"body2"}>Platz {value["platz"][0]}</Typography>
                                <Typography noWrap variant={"body2"}>Kronlachner</Typography>
                            </Paper>
                        </Grid>

                }
            }
        });

    }

    //Loads the admin of an entry
    function loadAdmin(entry){
        //TODO
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

    function navigationBar() {
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return <div className={'navigationBar'}>
            <Fab size={'small'} onClick={event => {
                setToday(new Date(today.setDate(today.getDate() - 2)));
            }}>
                <ArrowBack/>
            </Fab>
            <Button className={'todayButton'} onClick={event => {
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
        {/*This holds the navigation*/}
        {navigationBar()}
        <Grid className={'gridContainer'} container key={today} spacing={3}>
            {/*This maps the rows*/}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(value => {
                return <Grid container item className={'normalRow'} spacing={2} key={value}>
                    {generateRow(value)}
                </Grid>
            })}
        </Grid>
    </Card>

}

export default Home;