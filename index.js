const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const queryParser = require('query-string');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/complete', function (req, res) {
    parseBody(req, res);
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
            let response = JSON.stringify(event.body);
            res.send(`this is the body: ${response}`)
        } else {
            res.send("body is blank")
        }
    } else {
        res.send("body is not in event")
    }
}



module.exports.handler = serverless(app);
