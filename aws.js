const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();

AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
})

const service = {
    saveToDB: (params, res) => {
        // here's a reference for how to update the column names once questions
        // are finalized:
        // https://stackoverflow.com/questions/37817879/how-to-rename-dynamodb-column-key
        dynamoParams = {
            Item: {
                "years": {
                    S: params.years
                },
                "skills": {
                    S: params.skills
                },
                "grades": {
                    S: params.grades
                },
                "college_major": {
                    S: params.college_major
                },
                "email": {
                    S: params.email
                },
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: 'forge-survey-results-TEST2'
        };
        dynamodb.putItem(dynamoParams, function(err, data){
            if(err) {
                console.log(err);
                res.send("Failed to upload to database");
            } else {
                console.log("Sucessfully uploaded data", data);
                res.send("Success!");
            }
        })
    }
}

module.exports = service;
