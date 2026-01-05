from typing import Dict, Any

class PromptManager:
    """
    Centralized manager for prompt templates and local context injection.
    """
    
    WEST_AFRICAN_CONTEXT = {
        "ghana": {
            "stressors": [
                "Harmattan (dry dusty winds/drought risk)",
                "Coastal erosion in Keta and Ada",
                "Flooding in Accra due to poor drainage",
                "Cocoa crop vulnerability to shifting rainfall"
            ],
            "adaptation": [
                "Climate-smart cocoa farming",
                "Sea defense projects",
                "Borehole drilling for drought resilience"
            ]
        }
    }

    DECOMPOSER_TEMPLATE = """
You are an expert climate scientist specializing in West African climate patterns, specifically Ghana. 
Your task is to analyze the user's question and identify the single most critical scientific concept needed for a layperson to understand the answer.

LOCAL CONTEXT FOR GHANA:
{context_data}

If the user's input is conversational (greeting, thanks), meta-commentary, or not about climate science, return "General Conversation" or "Context Verification" as the concept.

Return your answer as a JSON object with a single key: "concept".

User Question: "{user_question}"

JSON output: 
"""

    EXPLAINER_TEMPLATE = """
You are an expert climate scientist. Provide a clear, direct, and accurate explanation of the requested concept.

Styles:
- Be concise and factual.
- Avoid overused analogies.
- Do not dumb it down excessively; respect the user's intelligence.

Return your explanations as a JSON object with a single key: "explanation". 

Concept to Explain: "{concept}"

JSON output: 
"""

    SYNTHESIZER_TEMPLATE = """
You are "Atmo", a helpful climate assistant with deep knowledge of Ghana's climate science. 

INPUTS:
1. User's Question: "{original_question}"
2. Background Knowledge: "{explanation}"
3. Conversation History: {history}

LOCAL CONTEXT:
{context_data}

INSTRUCTIONS:
- Use the Background Knowledge to inform your answer.
- IMPORTANT: Prioritize Ghana-specific data and local impacts (e.g., cocoa farms, Accra drainage, sea-level rise in Keta).
- Maintain continuity with history.
- Be direct and professional. Avoid filler phrases.

Response (Plain Text):
"""

    def __init__(self):
        self.context_str = self._format_context()

    def _format_context(self) -> str:
        ghana = self.WEST_AFRICAN_CONTEXT["ghana"]
        stressors = "\n- ".join(ghana["stressors"])
        adaptation = "\n- ".join(ghana["adaptation"])
        return f"Stressors:\n- {stressors}\n\nAdaptation Strategies:\n- {adaptation}"

    def get_decomposer_prompt(self, question: str) -> str:
        return self.DECOMPOSER_TEMPLATE.format(
            user_question=question,
            context_data=self.context_str
        )

    def get_explainer_prompt(self, concept: str) -> str:
        return self.EXPLAINER_TEMPLATE.format(concept=concept)

    def get_synthesizer_prompt(self, question: str, explanation: str, history_text: str) -> str:
        return self.SYNTHESIZER_TEMPLATE.format(
            original_question=question,
            explanation=explanation,
            history=history_text,
            context_data=self.context_str
        )

# Legacy constants for backward compatibility if needed during transition
DECOMPOSER_PROMPT_TEMPLATE = PromptManager.DECOMPOSER_TEMPLATE
EXPLAINER_PROMPT_TEMPLATE = PromptManager.EXPLAINER_TEMPLATE
SYNTHESIZER_PROMPT_TEMPLATE = PromptManager.SYNTHESIZER_TEMPLATE