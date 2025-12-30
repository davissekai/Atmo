from .llm import call_gemini, stream_gemini

from .prompts import DECOMPOSER_PROMPT_TEMPLATE, EXPLAINER_PROMPT_TEMPLATE, SYNTHESIZER_PROMPT_TEMPLATE


def get_climate_response(question, history=None):
    """
    Service Layer: Orchestrates the 3-step climate chain.
    """
    # 1. Format history for the prompt
    history_text = "No previous history."
    if history:
        history_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in history])

    # 2. Step 1: Decompose
    full_prompt = DECOMPOSER_PROMPT_TEMPLATE.format(user_question=question)
    response = call_gemini(full_prompt)
    concept = response['concept']

    # 3. Step 2: Explain
    full_prompt = EXPLAINER_PROMPT_TEMPLATE.format(concept_to_explain=concept)
    response = call_gemini(full_prompt)
    explanation = response['explanation']

    # 4. Step 3: Synthesize with history
    full_prompt = SYNTHESIZER_PROMPT_TEMPLATE.format(
        original_question=question, 
        explanation=explanation,
        history=history_text
    )

    return stream_gemini(full_prompt)
    

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