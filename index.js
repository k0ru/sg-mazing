const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.post('/complete', function (req, res) {
  res.send('sup')
})

// app.get('/complete', function (req, res){
//     console.log(req, res, "you've made it!");
// })

module.exports.handler = serverless(app);
