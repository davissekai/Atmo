import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# 1. Configure the API with your key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def call_gemini(prompt):
    model = genai.GenerativeModel("gemini-3-flash-preview")
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    return json.loads(response.text)


def stream_gemini(prompt):
    """
    Calls Gemini and returns a stream of responses word-by-word. Used for the final synthesis step
    """
    model = genai.GenerativeModel("gemini-3-flash-preview")
    response_stream = model.generate_content(prompt, stream=True)
    return response_stream
    


