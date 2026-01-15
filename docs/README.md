# Atmo

Atmo is an AI-powered climate science Q&A web application. It helps users understand complex climate concepts by breaking down questions, explaining key scientific concepts, and synthesizing easy-to-understand answers using the Gemini API.

## Architecture

Atmo is built as a FastAPI Web Application. It orchestrates a 3-step chain (Decompose -> Explain -> Synthesize) using Google's Gemini LLM to provide high-quality climate information.

## Setup

### Prerequisites

- Python 3.8+
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd atmo
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

Start the web server using `uvicorn`:

```bash
uvicorn app:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### API Endpoints

- **POST /ask**: Submit a climate question.
  - Body: `{"question": "Why is the ocean rising?"}`
  - Response: Streaming text response.

## Testing

To run the tests and verify the logic:

```bash
pytest
```


jules made this by the way
