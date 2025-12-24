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






