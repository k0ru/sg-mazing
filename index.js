const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const queryParser = require('query-string');

app.use(express.json());

app.post('/complete', function (req, res) {
    let event = req;

    let body;
    // in sg-hooks, checking to make sure it's an object - for now we need to make sure its' a string
    if ('body' in event) {
        if (typeof event.body === 'string') {
            if (typeof event.body === 'string' &&
                    event.body.trim().slice(0, 1) === '{' &&
                    event.body.trim().slice(-1) === '}'){ // isJSONstring
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
                res.send(`this is the body: ${body}`);
            }
        } else if (typeof event.body === 'object' && !Array.isArray(event.body)) {
            // body = JSON.stringify(event.body);
            res.send("body is object")
        } else {
            res.send("body be blank")
        }
    } else {
        res.send("body is not in event")
    }
});
    //   if (typeof event.body === 'string') {
    //     if ( (typeof str === 'string' &&
    //         str.trim().slice(0, 1) === '{' &&
    //         str.trim().slice(-1) === '}'),)
    //       try {
    //         body = JSON.parse(event.body);
    //         res.send("There is a body and it's a string")
    //       } catch (err) {
    //         throw err;
    //       }
    //     } else if (/=|\&/g.test(event.body)) {
    //         res.send('There is a body with a regular expression')
    //       // body = queryParser.parse(event.body);
    //     } else {
    //       body = event.body;
    //
    //     }
    //   } else if (typeof event.body === 'object' && !Array.isArray(event.body)) {
    //       res.send("there is a body that's an object and it's not an array")
    //     // body = event.body;
    //   } else {
    //       res.send("body is empty")
    //     body = {};
    //   }
    // }
    // if (!body) {
    //     res.send("no body");
    // }
    // res.send("ugh chaos")
    // body was empty
    // let response = JSON.stringify(req.body);
    // res.send(`You sent ${body} to Express`);
// });
//
// isJsonString: str =>
//     (typeof str === 'string' &&
//     str.trim().slice(0, 1) === '{' &&
//     str.trim().slice(-1) === '}'),
//
// parseBody: event => {
//     let body;
//
//     if (event && 'body' in event) {
//       if (typeof event.body === 'string') {
//         if (utils.isJsonString(event.body)) {
//           try {
//             body = JSON.parse(event.body);
//           } catch (err) {
//             throw err;
//           }
//         } else if (/=|\&/g.test(event.body)) {
//           body = queryParser.parse(event.body);
//         } else {
//           body = event.body;
//         }
//       } else if (typeof event.body === 'object' && !Array.isArray(event.body)) {
//         body = event.body;
//       } else {
//         body = {};
//       }
//     }
//     if (!body) {
//       winston.error(`[utils][parseBody] - I got an event with no body,
//         which seems strange - %j`, event);
//       body = event;
//     }
//     return body;
// },

/** when survey gizmo makes that request:
 - parse it so that the app can handle it - look at utils /parseBody method in sg-hooks
 - send it to Josh

**/
module.exports.handler = serverless(app);
