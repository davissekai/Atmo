from llm import call_gemini

def test_call_gemini_json_parsing():
    # 1. Setup: A prompt that forces a specific JSON response
    test_prompt = "Return JSON with a key 'greeting' and value 'hello world'" 

    # 2. Action: Call our reusable engine
    result = call_gemini(test_prompt)

    # 3. Assertion: Check if the unit test (the function) did its job.
    assert isinstance(result, dict)         # is it a dictionary?
    assert "greeting" in result             # does it have the key we expect?
    assert result["greeting"] == "hello world"    # does it have the value we expect? 
     