const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();

AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
})

const service = {
    saveToDB: (params) => {
        console.log('here are the params', params);
        dynamoParams = {
            Item: {
                "userID": {
                    S: params.userID
                },
                "email": {
                    S: params.email
                },
                "q1": {
                    S: params.q1
                },
                "q2": {
                    S: params.q2
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: 'forge-sg-survey-results-TEST'
        };
        dynamodb.putItem(dynamoParams, function(err, data){
            if(err) {
                console.log(err)
            } else {
                console.log("Sucessfully uploaded data", data)
            }
        })
    }
}

module.exports = service;
