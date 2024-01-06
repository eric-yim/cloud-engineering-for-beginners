#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatGptWrapperStack } from '../lib/chat_gpt_wrapper_stack';

// This is the account and region your app will deploy to
// Note you will need to have credentials for the account install on your computer
const app = new cdk.App();
new ChatGptWrapperStack(app, 'CdkProject', {
  env: {
    account: '011879672427',
    region: 'us-west-1',
  },
});
