import requests
import json
import uuid

BASE_URL = "http://localhost:8001"

def test_api():
    print("🚀 Starting Atmo API Verification Test...")
    
    # 1. Test /sessions (GET)
    print("\n[1/4] Testing GET /sessions...")
    try:
        res = requests.get(f"{BASE_URL}/sessions")
        if res.status_code == 200:
            print(f"✅ Success! Found {len(res.json())} sessions.")
        else:
            print(f"❌ Failed! Status Code: {res.status_code}")
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return

    # 2. Test /ask (POST - Streaming)
    print("\n[2/4] Testing POST /ask (Streaming)...")
    session_id = str(uuid.uuid4())
    payload = {
        "question": "What is the impact of sea level rise on coastal Ghana?",
        "session_id": session_id
    }
    
    try:
        with requests.post(f"{BASE_URL}/ask", json=payload, stream=True) as r:
            if r.status_code == 200:
                print("✅ Streaming started. Receiving response:")
                full_text = ""
                for chunk in r.iter_content(chunk_size=None, decode_unicode=True):
                    if chunk:
                        print(chunk, end="", flush=True)
                        full_text += chunk
                print("\n✅ Stream completed successfully.")
            else:
                print(f"❌ Failed! Status Code: {r.status_code}")
                print(r.text)
    except Exception as e:
        print(f"❌ Error during /ask: {e}")

    # 3. Test /history/{session_id} (GET)
    print(f"\n[3/4] Testing GET /history/{session_id}...")
    try:
        res = requests.get(f"{BASE_URL}/history/{session_id}")
        if res.status_code == 200:
            history = res.json()
            print(f"✅ Success! Found {len(history)} messages in session {session_id}.")
        else:
            print(f"❌ Failed! Status Code: {res.status_code}")
    except Exception as e:
        print(f"❌ Error during /history: {e}")

    # 4. Cleanup Test Session (DELETE)
    print(f"\n[4/4] Cleaning up test session {session_id}...")
    try:
        res = requests.delete(f"{BASE_URL}/sessions/{session_id}")
        if res.status_code == 200:
            print("✅ Session deleted successfully.")
        else:
            print(f"❌ Failed! Status Code: {res.status_code}")
    except Exception as e:
        print(f"❌ Error during DELETE: {e}")

    print("\n✨ API Verification Finished.")

if __name__ == "__main__":
    test_api()
