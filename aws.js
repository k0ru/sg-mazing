const AWS = require('aws-sdk');
const attr = require('dynamodb-data-types').AttributeValue;

const dynamodb = new AWS.DynamoDB();
//ykjvlmfz3g.execute-api.us-east-1.amazonaws.com/dev/complete

AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
})

const service = {
    saveToDB: (params, res) => {
        // here's a reference for how to update the column names once questions
        // are finalized:
        // https://stackoverflow.com/questions/37817879/how-to-rename-dynamodb-column-key

        // added a wrapper to handle json data fields
        const improvement = attr.wrap(params.improvement);
        const k7 = attr.wrap(params.koru7);
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
                    S: params.involvement
                },
                "improvement": {
                    M: improvement
                },
                "missing_goals": {
                    S: params.missing_goals
                },
                "koru7": {
                    M: k7
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
