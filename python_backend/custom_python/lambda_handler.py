from util.openai_util import ChatGPTPrompter
from util.quiz_util import prepare_messages, ResponseParser
from util.html_constructor import HtmlConstructor
import logging
import json
import random
# Configure the logger
logger = logging.getLogger()

logger.setLevel(logging.INFO)
HEADERS = {
            'Access-Control-Allow-Origin': '*'
    }


def lambda_handler(event, context):
    # Log the event
    logger.info(event)
    if event['httpMethod'] == 'GET':
        return get_handler(event, context)
    elif event['httpMethod'] == 'POST':
        return post_handler(event, context)
    raise NotImplementedError("Unrecognized method")
    
def get_handler(event, context):
    try:
        # This get METHOD IS JUST A DUMMY METHOD
        #a = [random.random() for _ in range(200000)]
        #a.sort()

        CHOICES = ['hello', 'sunshine', 'serendipity','fun']
        body = CHOICES[random.randint(0,len(CHOICES)-1)]

        #body = ChatGPTPrompter.prompt(MESSAGES)
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'message':body})
        }

    except Exception as e:
        logger.error(f"Error with main get handler: {e}")
        return {
            'statusCode':500,
            'headers': HEADERS,
            'body': 'Internal error'
        }
    return {
        'statusCode': 501,
        'headers': HEADERS,
        'body': 'Default error'
    }
        
    
def post_handler(event, content):
    try:
        logger.info(event)
        body = json.loads(event['body'])
        info = {'CONTENT':body['content'],'NUMBER':body['number']}
        messages = prepare_messages(**info)
        resp = ChatGPTPrompter.prompt(messages)
        questions = ResponseParser.parse_from_text(resp)
        body = HtmlConstructor.construct_quiz(questions)
        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'innerHTML':body})
        }
    except Exception as e:
        logger.error(f"Error with post handler: {e}")
    return {
        'statusCode': 501,
        'headers': HEADERS,
        'body': 'Default error'
    }

