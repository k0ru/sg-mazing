# Overview #  
This app exists to get data out of SurveyGizmo for the Forge project and into a DynamoDB table for further processing.
The current DynamoDB it is configured to post to is called 'forge-survey-results-TEST2'.
The survey is https://www.surveygizmo.com/s3/4514469/TEST-Shortened-Hiring-Profile-Builder-for-FORGE

If you create a new survey, simply create a webhook action at the end of the survey that posts to the https://ykjvlmfz3g.execute-api.us-east-1.amazonaws.com/dev/complete url
and specify the custom fields you want to be sent to the API. Be sure to change the mapping of the questions in the app and update the DynamoDB fields or create a new DynamoDB table.

# Updating the DynamoDB Table #
Once you have the questions finalized, you can create a new DynamoDB table to store data in.
Here are some facts about what user / role / policies are currently associated in case you need to change it:
User: forge-SurveyGizmo
Role: sg-mazing-dev-us-east-1-lambdaRole
Policy: DynamoDB full read / write access

I made email address the partition key, which means if a person uses the same email address to take a survey more than once their previous survey results will be overwritten in the table.

NOTE: IMPORTANT!!! It would be beneficial and highly recommended to add more limits to the policy so that it only reads / writes to the new DynamoDB table you create.

# Set up #
- `npm install` to install local node_modules
- `sls deploy` to redeploy app after making changes
- `sls logs -f webhook -t` to tail the logs

# Test the App #
- Send a POST request with the required params to
OR
- Fill out https://www.surveygizmo.com/s3/4514469/TEST-Shortened-Hiring-Profile-Builder-for-FORGE and check out the results of that survey in DynamoDB.
The survey has a POST webhook to the https://ykjvlmfz3g.execute-api.us-east-1.amazonaws.com/dev/complete endpoint.

You can view the logs of the app with `sls logs -f webhook -t` (which live tails the logs)
