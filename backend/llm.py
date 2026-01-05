import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Using Gemini 1.5 Flash for fast, high-quality responses
MODEL_NAME = "gemini-2.5-flash"


def call_gemini(prompt):
    """
    Calls Gemini API and returns a JSON response.
    """
    try:
        model = genai.GenerativeModel(model_name=MODEL_NAME)
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        text = response.text.strip()
        # Handle if response has markdown code blocks
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise


def stream_gemini(prompt):
    """
    Calls Gemini API and yields streaming responses.
    """
    try:
        model = genai.GenerativeModel(model_name=MODEL_NAME)
        response = model.generate_content(prompt, stream=True)

        class Chunk:
            def __init__(self, text):
                self.text = text

        for chunk in response:
            if chunk.text:
                yield Chunk(chunk.text)

    except Exception as e:
        print(f"Error streaming Gemini: {e}")
        raise
