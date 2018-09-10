const express = require('express');
const bodyParser = require("body-parser");
const queryParser = require('query-string');
const serverless = require('serverless-http');

const app = express();
const awsLib = require('./aws');

const idMap = {
    "email": 7,
    "grades": 166,
    "majors": 167,
    "name": 227,
    "involvement": 228,
    "improvement": 229,
    "missing_goals": 230,
    "koru7": 231,
    "prior_industry": 233,
    "prior_role": 234,
    "extracurricular":235,
    "college_rank": 236
};

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
            body = JSON.parse(event.body.response);
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

// This function just maps the rank to the option choice for scoring
function parseRanking(params) {
    let newMap = {};
    let answers = params.answer;

    for (answer in answers) {
        let newKey = answers[answer].option;
        newMap[newKey] = answers[answer].rank;
    }
    return newMap;
}

// you'll have to manually update these values when you change what questions are asked,
// as well as the fields accepted for the DynamoDB.
function parseParameters(body){
    body = body.survey_data;
    let improvement = parseRanking(body[idMap.improvement]);
    let koru7 = parseRanking(body[idMap.koru7]);

    const params = {
        grades: body && body[idMap.grades].answer,
        college_major: body && body[idMap.majors].answer,
        email: body && body[idMap.email].answer,
        name: body && body[idMap.name].answer,
        involvement: body && body[idMap.involvement].answer,
        improvement: body && improvement,
        missing_goals: body && body[idMap.missing_goals].answer,
        koru7: body && koru7,
        prior_industry: body && body[idMap.prior_industry].answer,
        prior_role: body && body[idMap.prior_role].answer,
        extracurricular: body && body[idMap.extracurricular].answer,
        college_rank: body && body[idMap.college_rank].answer
    };
    console.log("params ", params);
    return params;
}

module.exports.handler = serverless(app);
