import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# 1. Configure the API with your key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def call_gemini(prompt):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise


def stream_gemini(prompt):
    """
    Calls Gemini and returns a stream of responses word-by-word. Used for the final synthesis step
    """
    try:
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        response_stream = model.generate_content(prompt, stream=True)
        return response_stream
    except Exception as e:
        print(f"Error streaming Gemini: {e}")
        raise
    


