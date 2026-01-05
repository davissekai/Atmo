from .llm import call_gemini, stream_gemini
from .prompts import PromptManager

# Initialize centralized prompt manager
prompt_manager = PromptManager()

def get_climate_response(question, history=None):
    """
    Service Layer: Orchestrates the 3-step climate chain with reasoning markers.
    """
    # 1. Format history for the prompt
    history_text = "No previous history."
    if history:
        history_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in history])

    # 2. Step 1: Decompose
    yield "[[START_THOUGHT]]Analyzing your question...[[END_THOUGHT]]"
    
    decomposer_prompt = prompt_manager.get_decomposer_prompt(question)
    response = call_gemini(decomposer_prompt)
    concept = response.get('concept', 'Unknown Concept')

    yield f"[[START_THOUGHT]]Focusing on: {concept}[[END_THOUGHT]]"

    # 3. Step 2: Explain
    explainer_prompt = prompt_manager.get_explainer_prompt(concept)
    response = call_gemini(explainer_prompt)
    explanation = response.get('explanation', 'No explanation available.')

    yield f"[[START_FACT]]{explanation}[[END_FACT]]"

    # 4. Step 3: Synthesize with history
    synthesizer_prompt = prompt_manager.get_synthesizer_prompt(
        question=question, 
        explanation=explanation,
        history_text=history_text
    )

    yield "[[START_ANSWER]]"
    for chunk in stream_gemini(synthesizer_prompt):
        yield chunk.text
    yield "[[END_ANSWER]]"
    

def main():
    """
    Interface Layer: Handles persistent user interaction via the terminal.
    """
    history = []
    
    while True:
        # 1. Get input
        print("\n" + "-" * 11 + " ATMO " + "-" * 11)
        question = input(" What do you want to know about climate science today?\n (Type 'exit' to quit)\n\n > ")

        # 2. Check for exit
        if question.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
        
        # 3. Handle empty questions
        if not question.strip():
            continue

        print("\n" + "=" * 50 + "\n")

        # 4. Try-Except Shield
        try:
            response_stream = get_climate_response(question, history=history[-6:]) # Keep last 3 turns
            
            full_response = ""
            for chunk in response_stream:
                print(chunk.text, end="", flush=True)
                full_response += chunk.text
            
            # 5. Save to local history
            history.append({"role": "user", "content": question})
            history.append({"role": "assistant", "content": full_response})
            
        except Exception as e: 
            print(f"I hit a snag: {e}")
            print("Please check your internet connection and try again.")
    
        print("\n" + "=" * 50 + "\n")

if __name__ == "__main__":
    main()