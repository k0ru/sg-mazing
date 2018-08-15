const express = require('express');
const bodyParser = require("body-parser");
const queryParser = require('query-string');
const serverless = require('serverless-http');

const app = express();
const awsLib = require('./aws');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/complete', function (req, res) {
    const body = parseBody(req, res);
    parseParameters(body);
});

function isJsonString(str){
    (typeof str === 'string' &&
    str.trim().slice(0, 1) === '{' &&
    str.trim().slice(-1) === '}')
}

function parseBody(req, res){
    let event = req;
    let body;
    if ('body' in event) {
        if (typeof event.body === 'string') {
            if (isJsonString(event.body)) {
              try {
                body = JSON.parse(event.body);
              } catch (err) {
                  throw err;
              }
            } else if (/=|\&/g.test(event.body)) {
                body = queryParser.parse(event.body);
            } else {
                body = event.body;
            }
        } else if (typeof event.body === 'object' && !Array.isArray(event.body)) {
            let response = JSON.stringify(event.body);
            console.log("this is the response: ", response);
            body = event.body;
        } else {
            body = {};
        }
    } else {
        console.log("Received an event with no body", event)
        body = event;
    }
    return body;
}

function parseParameters(body){

    const params = {
        userID: body && body.userID,
        email: body && body.email,
        q1: body && body.grades,
        q2: body && body.college_major
    };
      awsLib.saveToDB(params);
}


module.exports.handler = serverless(app);
