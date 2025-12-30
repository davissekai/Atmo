import uuid
from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

from backend.main import get_climate_response
from backend import database

app = FastAPI(          # This is an instance of the end point.. and within it are its details.
            title="Atmo",
            description="LLM-powered climate Q&A",
            version="0.1.0")

# Initialize database immediately
database.init_db()

# Serving the Figma-inspired React UI (from the build folder)
app.mount("/static", StaticFiles(directory="frontend/build"), name="static")

@app.get("/")
async def root():
    """Redirect root to the new React interface."""
    return RedirectResponse(url="/static/index.html")

class Query(BaseModel):
    """Schema for the request body."""
    question: str
    session_id: Optional[str] = None

@app.post("/ask")
async def ask_climate(query: Query):
    """
    Receives a climate question, retrieves history, and streams the LLM response.
    Saves the interaction to the database.
    """
    # 1. Handle session_id
    current_session = query.session_id or str(uuid.uuid4())

    try:
        # 2. Save User Question IMMEDIATELY (Systems Guy tip: Save input before processing)
        database.save_message(current_session, "user", query.question)

        # 3. Fetch history from database (including the question we just saved if we want, or just previous)
        history = database.get_history(current_session, limit=11) # Get pre-existing context

        # 4. Get response stream from service layer
        response_stream = get_climate_response(query.question, history=history[:-1]) # Don't pass the current question twice

        def generate():
            full_response = ""
            try:
                for chunk in response_stream:
                    full_response += chunk.text
                    yield chunk.text
                
                # 5. Save AI response once streaming finishes successfully
                database.save_message(current_session, "assistant", full_response)
            except Exception as e:
                # Capture partial response even if it fails mid-stream
                error_msg = f"[Error mid-stream: {str(e)}]"
                database.save_message(current_session, "assistant", full_response + error_msg)
                yield error_msg

        return StreamingResponse(
            generate(), 
            media_type="text/plain",
            headers={"X-Session-ID": current_session}
        )

    except Exception as exc:
        # Log error to DB as well for visibility
        database.save_message(current_session, "error", str(exc))
        raise HTTPException(status_code=500, detail=str(exc))
        
