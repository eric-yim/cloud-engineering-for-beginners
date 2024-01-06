```
aws lambda create-function \
--function-name rest_api_python \
--runtime python3.11 \
--role arn:aws:iam::011879672427:role/rest_api_role \
--handler rest_api.lambda_handler.lambda_handler \
--zip-file fileb:///home/ericyim/Desktop/projects/cdk_api/rest_api_python/rest_api_python.zip 
```

```
aws lambda update-function-code --function-name rest_api_python --zip-file fileb:///home/ericyim/Desktop/projects/cdk_api/rest_api_python/rest_api_python.zip 

```


```
aws lambda update-function-configuration \
--function-name rest_api_python \
--handler rest_api.lambda_handler.lambda_handler
```

```
aws lambda update-function-configuration --function-name rest_api_python --environment Variables={OPENAI_API_KEY=YOURKEYHERE}
```

If creating new environment. This makes a zip with all needed dependencies.
```
./build_all.sh
```

If using existing build_env folder.
```
./build_with_existing_env.sh
```