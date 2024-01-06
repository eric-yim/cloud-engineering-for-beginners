# Cloud Engineering for Beginners

This repo is the code for a demo for the following videos:
- Youtube
- Tiktok

## Layout

There are 3 main folders. 
- **cloud_eng_cdk** contains CDK code (Infrastructure as Code), which describes the cloud resources that will be created in your AWS account. 
- **python_backend** contains python code which will be executed on the backend. 
- **html_frontend** contains code for your frontend, which basically just calls the backend api.

## Set Up

Altogether to run this project for a short while, you should incur costs less than a few US dollars.

1. AWS Account

You will need an AWS account. You can create a free tier account. The Infrastructure code will create an ApiGateway endpoint and a lambda. Lambdas only use compute when they are invoked, so most of the time nothing will be running in your account, until you start using your API. 

You may also want to install AWS CLI. (Search for the latest instructions. It's useful for configuring your credentials). Once you've done that, run this command and follow prompts.

```
aws configure
```


2. OpenAI API Key

Visit OpenAI developer site and get an API key.

3. Node.js 

Search for how to install node.js. It also includes npm.

## Creating a .zip File for Your Python Backend

Go into **python_backend** folder and run 

```
./build_all.sh
```

Note this command only works on linux-like operating systems. You can open the file with a text editor to see what is going on:

1. Installing requirements.txt to a target folder
2. Copying the current directory, the util folder, and the requirements folder into a zip
3. Copy the zip into the **cdk-project** folder

## Deploying your CDK code

Now you can install the package required for AWS CDK. Run below.

```
npm install aws-cdk-lib
```

Now that you've run the above, when you run the 2 commands below, it should deploy code to your AWS account. Run the command from the **cdk-project** folder.
```
npm run build
cdk deploy
```

Then go to AWS Console >> Lambda >> Configure. Create an environment variable called **OPENAI_API_KEY** and make the value your api key. The Lambda will then be able to use your key.

## Front End

You can deploy your front end in a variety of ways. Github pages is one free option (look that up). Make sure to set up 2 items:
1. In **html_frontend**, quiz/form.js contains an endpoint. You need to point this endpoint to the one from your API Gateway.
2. In **cdk-project**, lib/chat_gpt_wrapper_stack.ts contains CORS settings. You need to provide the url that your front end is hosted, for example https://YOURUSER.github.io.

Now you should have a Front End which calls your Back End - which is hosted through AWS Cloud Infrastructure. Nice!!


## AWS Hints

Once you've deployed your resources you can do the following from the AWS Console (log into your account):

- **CloudWatch** View logs

- **Lambda** You can press the "test" button and give sample messages to the lambda function. Set environment variables such as your API KEY.

- **APIGateway** You can test messages to your api endpoint. And also view the url to your endpoint.

- **CloudFormation** You can see all the cdk resources your deployed. You can also manually delete all the resources associated with your deployment. **Note you should delete your resources once you're done with the project to avoid being charged**

