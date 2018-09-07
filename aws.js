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
                "grades": {
                    S: params.grades
                },
                "college_major": {
                    S: params.college_major
                },
                "email": {
                    S: params.email
                },
                "name": {
                    S: params.name
                },
                "involvement": {
                    NS: params.involvement
                },
                "improvement": {
                    S: params.improvement
                },
                "missing_goals": {
                    S: params.missing_goals
                },
                "koru7": {
                    NS: params.koru7
                },
                "prior_industry": {
                    S: params.prior_industry
                },
                "prior_role": {
                    S: params.prior_role
                },
                "extracurricular": {
                    S: params.extracurricular
                },
                "college_rank": {
                    S: params.college_rank
                }
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
