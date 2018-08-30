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
    awsLib.saveToDB(params, res);
});

function isJsonString(str){
    (typeof str === 'string' &&
    str.trim().slice(0, 1) === '{' &&
    str.trim().slice(-1) === '}')
}

// The below type checks are adopted from the current implementation in sg-hooks.
// While I believe we should only ever receive the request as an object from SG-hooks,
// I kept the same type checks as sg-hooks just in case.
function parseBody(req, res){
    let event = req;
    let body;
    if ('body' in event) {
        if (typeof event.body === 'string') {
            if (isJsonString(event.body)) {
              try {
                body = JSON.parse(event.body);
              } catch (err) {
                  const errMsg = `There was an error parsing string as JSON: ${err}`;
                  res.send(errMsg);
                  throw err;
              }
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
        let noBodyMsg = "No event body given!"
        console.log(noBodyMsg);
        res.send(noBodyMsg);
    }
    return body;
}

// you'll have to manually update these values when you change what questions are asked,
// as well as the fields accepted for the DynamoDB.
// Another option is to build a dumb iterator that makes the key the question number
// and the value the value of each property contained in the body
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
