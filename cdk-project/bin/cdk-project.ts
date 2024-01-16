#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatGptWrapperStack } from '../lib/chat_gpt_wrapper_stack';


// Set AWS credentials using environment variables
// process.env.AWS_ACCESS_KEY_ID = 'your-access-key-id';
// process.env.AWS_SECRET_ACCESS_KEY = 'your-secret-access-key';

/*
You need to provide credentials so that the stack can be deployed to your account.
The method above should work, however, best practices recommend you not to have secrets hardcoded.
An alternative is to install AWS CLI. Then run "aws configure" to create a local file with your credentials.
*/

// This is the account and region your app will deploy to
// Note you will need to have credentials for the account install on your computer
const app = new cdk.App();
new ChatGptWrapperStack(app, 'CdkProject', {
  env: {
    account: '01234568789',//YOUR AWS ACCOUNT NUMBER
    region: 'us-west-1',//Choose a region closest to you to reduce latency. As a starter project, this shouldn't matter
  },
});
