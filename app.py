from fastapi import FastAPI, HTTPException  
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from main import get_climate_response


app = FastAPI(          # This is an instance of the end point.. and within it are its details.
            title="Atmo",
            description="LLM-powered climate Q&A",
            version="0.1.0")


# This is a class that defines the structure of the request body, but why a class.. a class is a blue print.. 
class Query(BaseModel):
    """Schema for the request body."""
    question: str

# this, I dont have much of an idea on what it does.. but it is a decorator. (Autocomplete put in there that its a decorator lol.. whats a decorator?)
@app.post("/ask")
async def ask_climate(query: Query):
    """
    Receives a climate question and streams the LLM response back.
    """
    try:
        response_stream = get_climate_response(query.question)

        def generate():
            for chunk in response_stream:
                yield chunk.text

        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
        
