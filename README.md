# Overview #  
This app exists to get data out of SurveyGizmo for the Forge project and into a DynamoDB table for further processing.
The current DynamoDB it is configured to post to is called 'forge-sg-survey-results-TEST'.
The survey is https://www.surveygizmo.com/s3/4514469/TEST-Shortened-Hiring-Profile-Builder-for-FORGE

# Set up #
- `npm install` to install local node_modules
- `sls deploy` to redeploy app after making changes
- `sls logs -f webhook -t` to tail the logs

# Test the App #
- Send a POST request with the required params to https://ykjvlmfz3g.execute-api.us-east-1.amazonaws.com/dev/complete
OR
- Fill out https://www.surveygizmo.com/s3/4514469/TEST-Shortened-Hiring-Profile-Builder-for-FORGE and check out the results of that survey in DynamoDB.
The survey has a POST webhook to the above url.
