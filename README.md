# Conversational AI Slack app

## Dependencies
The user will need to generate an OpenAI API token through https://platform.openai.com/api-keys

## Install the Slack CLI
Follow this guide to install the Slack CLI: https://api.slack.com/automation/quickstart

## Clone the repository with the Slack CLI

```
slack create ai-chat-app --template peoplesj/ai-chat-app/
```

## Enviornment variables
Within a `.env` file, add the OpenAI token as an enviornment variable. Follow the the structure shown in the `sample.env` file.

## Run the app locally
Use the command 
```
slack run
```

## Note
Be sure to invite your app to your testing channel so it has access to read the channel's messages.

