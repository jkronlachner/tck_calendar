import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './front_end/App';
import Calendar from './front_end/newCalendar'
import firestore from 'firebase';





firestore.initializeApp({
    apiKey: "AIzaSyC5Zt3LYjVQV-0VO_cYlZdYoWK90T5Vps8",
    authDomain: "tck-app-a1572.firebaseapp.com",
    projectId: "tck-app-a1572",
});


ReactDOM.render(<App key="app"/>, document.getElementById('root'));

