import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_session_memory():
    print("--- Testing Atmo Session Memory ---")
    
    # 1. Ask a first question
    q1 = {"question": "What is the primary cause of ocean acidification?"}
    print(f"\nUser: {q1['question']}")
    
    response1 = requests.post(f"{BASE_URL}/ask", json=q1, stream=True)
    print(f"Status Code: {response1.status_code}")
    print(f"Headers: {response1.headers}")
    session_id = response1.headers.get("X-Session-ID")
    print(f"Session ID: {session_id}")
    
    print("Assistant: ", end="", flush=True)
    for chunk in response1.iter_content(chunk_size=None):
        if chunk:
            print(chunk.decode(), end="", flush=True)
    print("\n")

    # 2. Ask a follow-up question (requires context)
    q2 = {"question": "How does this affecting coral reefs specifically?", "session_id": session_id}
    print(f"User: {q2['question']}")
    
    response2 = requests.post(f"{BASE_URL}/ask", json=q2, stream=True)
    print("Assistant: ", end="", flush=True)
    for chunk in response2.iter_content(chunk_size=None):
        if chunk:
            print(chunk.decode(), end="", flush=True)
    print("\n")

if __name__ == "__main__":
    test_session_memory()
