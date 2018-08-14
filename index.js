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
            if (typeof event.body === 'string' &&
                isJsonString(event.body)) {
                  try {
                    body = JSON.parse(event.body);
                    res.send("Body has been parsed to JSON object")
                  } catch (err) {
                    res.send(`There was an error: ${err}`)
                  }
            } else if (/=|\&/g.test(event.body)) {
                res.send("This is a regular expression") // queryParser
            } else {
                body = event.body;
                res.send(`this is the string it is: ${body}`);
            }
        } else if (typeof event.body === 'object' && !Array.isArray(event.body)) {
            // do nothing
            let response = JSON.stringify(event.body);
            // res.send(`this is the body: ${response}`)
            console.log("this is the response: ", response);
            parseParameters(event.body);
        } else {
            res.send("body is blank")
        }
    } else {
        res.send("body is not in event")
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
