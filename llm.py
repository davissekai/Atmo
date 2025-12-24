import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

# 1. Initialize the client once - it automatically looks for the GEMINI api key in the .env

client = genai.Client()

def call_gemini(prompt):
    response = client.models.generate_content(
        model = "gemini-3-flash-preview",
        contents = prompt,
        config = {
            'response_mime_type': 'application/json'

        }
        
    )

    return json.loads(response.text)


def stream_gemini(prompt):
    """
    Calls Gemini and returns a stream of responses word-by-word. Used for the final synthesis step
    """
    response_stream = client.models.generate_content_stream(
        model = "gemini-3-flash-preview",
        contents = prompt,

        # No config, since we're returning only plain text.
    )

    return response_stream
    


