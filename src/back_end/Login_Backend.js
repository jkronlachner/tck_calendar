


class Login_Backend{


    login = (username, passphrase) => {
        return new Promise(function (resolve, reject) {
            const firebase = require('firebase');
            var db = firebase.firestore();
            if (passphrase === "" || username === "") {
                console.log("Reject");
                reject({type: 'error', message: 'Benutzername oder Passwort darf nicht leer sein.'});
                return;
            }
            let collectionRef = db.collection('WebUsers').doc(username);

            collectionRef.get()
                .then(function(snap){
                    if (!snap.exists) {
                        return reject({type: 'error', message: 'Benutzername existiert nicht!'})
                    } else {
                        if(snap.data()["passphrase"]===passphrase){
                            return resolve({type: 'success', message: 'Boom!'});
                        }else{
                            return reject({type:'error', message: 'Passwort stimmt nicht mit dem Benutzernamen überein!'})
                        }

                    }
                })
                .catch(function(error){
                    return reject({type: 'error', message: 'Benutzername existiert nicht!'})
                })
        })


    };


}

export default Login_Backend