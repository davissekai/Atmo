import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

TARGET_MODEL = "gemini-2.5-flash"

try:
    print(f"Testing with model: {TARGET_MODEL}")
    model = genai.GenerativeModel(TARGET_MODEL)
    response = model.generate_content("Hello, this is a test. Are you there?")
    print("Response received successfully!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error with {TARGET_MODEL}: {e}")
