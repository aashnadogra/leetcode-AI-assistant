api_endpoints:
  - path: "/ask"
    description: "Handles AI-driven responses for LeetCode problem-solving inquiries."
    request:
      method: "POST"
      body:
        type: "Query"
        fields:
          url: "LeetCode problem URL."
          doubt: "User's specific question."
    process:
      - "Constructs a templated prompt including the problem URL and user query."
      - "Encourages AI to provide hints rather than direct solutions."
      - "Initializes the Gemini 1.5 Flash model to generate a response."
      - "Returns a JSON response containing the AI-generated hint."
    error_handling:
      - "Catches any exceptions that occur during processing."
      - "Returns an HTTP 500 error with exception details if needed."

  - path: "/nlp"
    description: "Extracts key sentences from a given text using NLP techniques."
    request:
      method: "POST"
      body:
        type: "TextInput"
        fields:
          text: "Text content to analyze."
    process:
      - "Loads spaCy model ('en_core_web_sm')."
      - "Defines a list of keywords indicating important sentences."
      - "Filters sentences containing these keywords."
      - "If no keywords are found, selects the first two sentences."
      - "Returns extracted key sentences as a JSON response."
    error_handling:
      - "Ensures a fallback mechanism for cases where no keywords are detected."

workflow:
  - "User sends a message in the chat."
  - "Frontend calls `/ask` endpoint to get an AI-generated response."
  - "If the response exceeds 250 characters, the `/nlp` endpoint condenses it."
  - "If 'explain' is in the request, a detailed response is returned instead."

modules:
  promptSelector.js:
    description: "Detects problem type (arrays, trees, DP, etc.) to provide specialized hints."
  promptTemplates.js:
    description: "Contains structured prompts for different problem categories."

features:
  - problem_specific_guidance:
      description: "AI responses are tailored based on detected problem type."
  - dynamic_response_adaptation:
      description: "Hints progress from gentle to direct based on conversation flow."
  - structured_prompt_engineering:
      example:
        - "promptPrefix = `You are a helpful LeetCode mentor...`"
        - "Uses guidance level and teaching stage for tailored responses."
  - conversation_stage_tracking:
      description: "System tracks user progress and adjusts responses accordingly."
