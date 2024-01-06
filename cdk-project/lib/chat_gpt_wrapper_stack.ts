import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
// You can also add storage resources like DynamoDB or S3
// import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

export class ChatGptWrapperStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Define the Lambda function
    const myLambda = new lambda.Function(this, 'customPythonLambda', {
      runtime: lambda.Runtime.PYTHON_3_11, // Make sure your python version matches your lambda code
      handler: 'custom_python.lambda_handler.lambda_handler', // Replace with your actual handler
      code: lambda.Code.fromAsset('custom_python.zip'),
      memorySize: 2000, //this is in MB
      timeout: cdk.Duration.seconds(60),
      logRetention: logs.RetentionDays.ONE_WEEK,
    });


    // Define the REST API
    const prodLogGroup = new logs.LogGroup(this, "customPythonApiAccessLogs");
    const customPythonApi = new apigateway.RestApi(this, 'customPythonApi', {
      restApiName: 'customPythonApi',
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(prodLogGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
      },
    });
    

    // Create an integration between the API and the Lambda function
    const integration = new apigateway.LambdaIntegration(myLambda);

    // Create a resource and method on the API
    const resource = customPythonApi.root.addResource('chatGptWrapper');
    resource.addMethod('POST', integration);
    resource.addMethod("GET", integration);
    // Set some limits
    customPythonApi.addUsagePlan('UsagePlan',
      {
        name: 'DefaultThrottling',
        throttle: {
          rateLimit: 1000, // average requests per second over an extended period of time
          burstLimit: 2500 // Limit over a few seconds
        }
      }
    )

    // Enable CORS for the specified page
    const corsOptions: apigateway.CorsOptions = {
      allowOrigins: [ 
        'https://eric-yim.github.io',// You need to specify here where the incoming traffic will come from. (Your front end)
      ], 
      allowMethods: ['GET', 'POST'], // Matches your resource L42-L44
    };

    resource.addCorsPreflight(corsOptions);

    // Main purpose of the following code is to protect your API from mis-use
    // https://aws.amazon.com/blogs/devops/easily-protect-your-aws-cdk-defined-infrastructure-with-aws-wafv2/
    const webACL = new wafv2.CfnWebACL(this, 'customPythonApiWebAcl', {
      defaultAction: {
        allow: {}
      },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName:'customPythonApiWebAcl',
        sampledRequestsEnabled: true,
      },
      name:'customPythonApiWebAcl',
      rules: [
        {
          name: 'CRSRule',
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              name:'AWSManagedRulesCommonRuleSet',
              vendorName:'AWS'
            }
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName:'customPythonApiWebAcl-CRS',
            sampledRequestsEnabled: true,
          },
          overrideAction: {
            none: {}
          },
        },
      ],
    });

    // Association
    // const cfnWebACLAssociation = new wafv2.CfnWebACLAssociation(this,'WebACLAssociation', {
    //   resourceArn:customPythonApi.deploymentStage.stageArn,
    //   webAclArn: webACL.attrArn,
    // });

    // Grant API Gateway permission to invoke the Lambda function
    myLambda.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
    
  }
}
