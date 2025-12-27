from llm import call_gemini, stream_gemini

from prompts import DECOMPOSER_PROMPT_TEMPLATE, EXPLAINER_PROMPT_TEMPLATE, SYNTHESIZER_PROMPT_TEMPLATE


def get_climate_response(question):
    """
    Service Layer: Orchestrates the 3-step climate chain.
    """
    full_prompt = DECOMPOSER_PROMPT_TEMPLATE.format(user_question=question)
    response = call_gemini(full_prompt)
    concept = response['concept']

    full_prompt = EXPLAINER_PROMPT_TEMPLATE.format(concept_to_explain=concept)
    response = call_gemini(full_prompt)
    explanation = response['explanation']

    full_prompt = SYNTHESIZER_PROMPT_TEMPLATE.format(original_question=question, explanation=explanation)
   

    return stream_gemini(full_prompt)
    

def main():
    """
    Interface Layer: Handles persistent user interaction via the terminal.
    """
    while True:
        # 1. Get input
        question = input("-----------ATMO------------\n\n What do you want to know about climate science today?\n\n ")

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
            response_stream = get_climate_response(question)

            for chunk in response_stream:
                print(chunk.text, end="", flush=True)
            
        except Exception as e: 
            print(f"I hit a snag: {e}")
            print("Please check your internet connection and try again.")
    
        print("\n" + "=" * 50 + "\n")

if __name__ == "__main__":
    main()