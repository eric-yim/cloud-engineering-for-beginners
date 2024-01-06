from openai import OpenAI
import os
import logging
logger = logging.getLogger()
OPEN_AI_KEY = "OPENAI_API_KEY"
# openai.api_key = os.environ.get('OPENAI_API_KEY')
api_key = os.getenv(OPEN_AI_KEY)
if api_key is None:
    logger.error(f"Requires environment variable {OPEN_AI_KEY}")
    raise
client = OpenAI()
class Embedder:
    @staticmethod
    def embed(text, model="text-embedding-ada-002"):
        text = text.replace("\n", " ")
        return client.embeddings.create(input = [text], model=model).data[0].embedding

class ChatGPTPrompter:
    @staticmethod
    def prompt(messages):
        response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
        return ChatGPTPrompter.parse_openai_response(response)
    @staticmethod
    def parse_openai_response(response):
        return response.choices[0].message.content