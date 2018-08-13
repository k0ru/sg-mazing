const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const queryParser = require('query-string');

app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));

app.post('/complete', function (req, res) {
    // body was empty
    let response = JSON.stringify(req.body);
    res.send(`You sent ${response} to Express`);
})
//
// isJsonString: str =>
//     (typeof str === 'string' &&
//     str.trim().slice(0, 1) === '{' &&
//     str.trim().slice(-1) === '}'),
//
parseBody: event => {
    let body;

    if (event && 'body' in event) {
      if (typeof event.body === 'string') {
        if (utils.isJsonString(event.body)) {
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
        body = event.body;
      } else {
        body = {};
      }
    }
    if (!body) {
      winston.error(`[utils][parseBody] - I got an event with no body,
        which seems strange - %j`, event);
      body = event;
    }
    return body;
},

/** when survey gizmo makes that request:
 - parse it so that the app can handle it - look at utils /parseBody method in sg-hooks
 - send it to Josh

**/
module.exports.handler = serverless(app);
