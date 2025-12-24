from llm import call_gemini

from prompts import DECOMPOSER_PROMPT_TEMPLATE, EXPLAINER_PROMPT_TEMPLATE, SYNTHESIZER_PROMPT_TEMPLATE

def main():
    """
    Docstring for climate assistant.main

    Here, we implement the logic for the chaining of prompts, and for the LLM to get to know what it gotta do with the input, and how to form the outputs.
    
    The main function will take the user's question, and pass it through the decomposer, explainer, and synthesizer prompts, and return the final answer.
    """
    question = input(" -----------CLIMATE SCIENCE ASSISTANT------------\n\n What do you want to know about climate science today?\n\n ")
    full_prompt = DECOMPOSER_PROMPT_TEMPLATE.format(user_question=question)
    response = call_gemini(full_prompt)
    concept = response['concept']

    full_prompt = EXPLAINER_PROMPT_TEMPLATE.format(concept_to_explain=concept)
    response = call_gemini(full_prompt)
    explanation = response['explanation']

    full_prompt = SYNTHESIZER_PROMPT_TEMPLATE.format(original_question=question, explanation=explanation)
    response = call_gemini(full_prompt)
    final_answer = response['final_answer']

    print(final_answer)

if __name__ == "__main__":
    main()
