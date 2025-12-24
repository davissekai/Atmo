from fastapi import FastAPI
from main import get_climate_response
from fastapi.responses import StreamingResponse

app = FastAPI(title="Climate Science Assistant API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Climate Science Assistant API. Use /ask?q=YOUR_QUESTION to interact."}

@app.get("/ask")
def ask_question(q: str):
    """
    Bridge to our Modular Service Layer!
    This endpoint takes a question 'q' and streams back the answer.
    """
    if not q:
        return {"error": "Please provide a question using the 'q' parameter."}
    
    # Because we refactored in Phase 2, we just call the function!
    response_stream = get_climate_response(q)
    
    def generate():
        for chunk in response_stream:
            yield chunk.text

    return StreamingResponse(generate(), media_type="text/plain")
