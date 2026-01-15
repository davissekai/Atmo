import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import get_climate_response

def test_chain():
    question = "How does climate change affect cocoa farming in Ghana?"
    print(f"Testing Question: {question}\n")
    
    try:
        response_stream = get_climate_response(question)
        
        for chunk in response_stream:
            # Handle both strings and complex objects if any
            if isinstance(chunk, str):
                print(chunk, end="", flush=True)
            else:
                # Assuming it might be a Gemini response chunk
                try:
                    print(chunk.text, end="", flush=True)
                except AttributeError:
                    print(str(chunk), end="", flush=True)
        
        print("\n\n✅ Test Complete!")
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")

if __name__ == "__main__":
    test_chain()
