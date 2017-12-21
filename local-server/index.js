/* Import modules */

const express = require('express');
const firebase = require('firebase');
const MicroGear = require('microgear');

const config = require('./config.js');

/* End import */
/* --------------------------------------------------------------------- */
/* Initialize modules */

firebase.initializeApp(config.firebase);
const app = express();
const microgear = MicroGear.create({
    key: config.microgear.key,
    secret: config.microgear.secret
});

//Initialize all microgear methods and callbacks

microgear.on('connected', () => {
    output('netpie connected', 'Connected to netpie.io');
});

microgear.on('message', (topic, msg) => {
    output('netpie message', `with topic (${topic}) : '${msg}'`);
    if (msg.indexOf(`[${config.commandKeyword}] - `) === 0) {
        const command = String(msg).substring(`[${config.commandKeyword}] - `.length, 100);
        output('command detected', command);
        switch(command) {
            case 'ADD':
                output('operation', '1 + 1');
                break;
            case 'SUB':
                output('operation', '1 - 1');
                break;
            default:
                output('operation', 'Something')
        }
    }
})

microgear.connect(config.microgear.appid);

/* End Init */
/* --------------------------------------------------------------------- */
/* Define functions */

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function isExist(obj) {
    return obj !== null && typeof obj !== "undefined";
}

function output(status = '', detail = '') {
    if (config.enableConsole) {
        status = status.substring(0, config.consoleStatusMaxLength);
        let rest = config.consoleStatusMaxLength - status.length;
        let newStatus = Array.from(Array(Math.ceil(rest/2)).keys()).map(() => " ").join("");
        newStatus += status.toLocaleUpperCase();
        newStatus += Array.from(Array(config.consoleStatusMaxLength - newStatus.length).keys()).map(() => " ").join("");
        console.log(`[${newStatus}] ${detail}`);
    }
}

function printLine(num = 30, char = '-') {
    if(config.enableConsole) console.log(Array.from(Array(num).keys()).map(() => char).join(""));
}

function resSend(res, status, obj) {
    if(config.enableConsole) {
        output('http response', `Response with status ${status} : '${obj.toString()}'`);
    }
    res.status(status).send(obj);
}

function sendSignalToMCU(res) {
    //Implement here
    output('signal', 'Sending signal to NodeMCU');

    microgear.setalias(config.microgear.alias);
    microgear.chat(config.microgear.alias, `[${config.commandKeyword}] - Hello`);

    if (isExist(res)) {
        resSend(res, 200, config.signalKeyword);
    }

}

//Listen to datababse
//Not a very good one but it still works. So maybe fix it later
function checkLocationChanges(machineId, res, lat, long) {
    printLine(config.consoleLineLength, '-');
    output('CHECK CHANGES', 'Callback is called');
    printLine(config.consoleLineLength, '-');
    const owner = firebase.database().ref(`machines/${machineId}/owner`);
    new Promise((resolve, reject) => {
        owner.on('value', (snapshot) => {
            output('READ FROM DB' ,`with path 'machines/${machineId}/owner'`);
            return resolve(snapshot.val());
        }, (error) => {
            reject('Cannot connect to firebase');
        });
    }).then((userId) => {
        const location = firebase.database().ref(`users/${userId}/private/location`);
        location.on('value', (snapshot) => {
            output('READ FROM DB', `with path 'users/${userId}/private/location'`);
            let { longitude, latitude } = snapshot.val();
            output('Calculating', `Check if distance is less than the specify distance`);
            if (getDistanceFromLatLonInKm(lat, long, latitude, longitude) < config.minDistance) {
                sendSignalToMCU(res);
            } else {
                resSend(res, 200, config.nonSignalKeyword);
            }
        });
    }).catch((e) => {
        output('ERROR', e.toString());
    });
}

function updateToDB(machineId, data) {
    let key = firebase.database().ref(`machines/${machineId}`).child('history').push().key;
    let updates = {};
    updates[`machines/${machineId}/history/${key}`] = data;
    firebase.database().ref().update(updates);
    output('UPDATED TO DB', `with path 'machines/${machineId}/history/${key}' successful`);
}

/* End functions */
/* --------------------------------------------------------------------- */
/* Define and run operations */

// checkLocationChanges(config.machineId);
// setInterval(() => checkLocationChanges(config.machineId), config.intervalTime);

app.use((req, res, next) => {
    output('incomming request', `Incomming request with path '${req.originalUrl}'`);
    return next();
})

/**
 * This path is to be called by NodeMCU regularly
 * It will conatain 2 parameters: length, and id.
 * If length is lower than the threshold (set in config file)
 * Then it will execute Location checking callback
 */

app.get('/checkLocChange', (req, res) => {
    let { length, id, lat, long } = req.query;
    if (!isExist(length)) length = 0;
    else length = parseFloat(length);

    if(!isExist(lat)) latitude = 0;
    else lat = parseFloat(lat);

    if(!isExist(long)) longitude = 0;
    else long = parseFloat(long);
    
    if(isExist(id)) {
        updateToDB(id, {
            length: length,
            timestamp: new Date().toISOString(),
            latitude: lat,
            longitude: long
        });
    }

    if (isExist(id) && length <= config.minLength) {
        checkLocationChanges(id, res, lat, long);
    } else {
        resSend(res, 200, config.nonSignalKeyword);
    }
})

app.get('/testDB', (req, res) => {
    let { id } = req.query;
    updateToDB(id, {
        test: "Hello"
    })
    resSend(res, 200, 'Send something to database');
});

app.listen(config.PORT, '192.168.1.123' || 'localhost', () => {
    console.log(`[START] Server is up and running at port ${config.PORT}
[CONFIG] Polling database every ${config.intervalTime/1000} second(s).`);
    printLine(config.consoleLineLength, '=');
});

/* End operations */
/* --------------------------------------------------------------------- */
/* Firebase cloud function code */

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// exports.notifyServerOnDBChange = functions.database.ref('users')
// .onWrite((event) => {
//     //Notify
// });

/* End code */
/* --------------------------------------------------------------------- */