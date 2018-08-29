const express = require('express');
const bodyParser = require("body-parser");
const queryParser = require('query-string');
const serverless = require('serverless-http');

const app = express();
const awsLib = require('./aws');

// for parsing application/x-www-form-urlencoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/complete', function (req, res) {
    const body = parseBody(req, res);
    const params = parseParameters(body);
    awsLib.saveToDB(params);
    res.send("Success!")
});

function isJsonString(str){
    (typeof str === 'string' &&
    str.trim().slice(0, 1) === '{' &&
    str.trim().slice(-1) === '}')
}

// The below type checks are adopted from the current implementation in sg-hooks.
// While I believe we should only ever receive strings from SG-hooks, I kept
// the same type checks as sg-hooks just in case.
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
            body = event.body;
        } else {
            body = {};
        }
    } else {
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
    return params;
}


module.exports.handler = serverless(app);
