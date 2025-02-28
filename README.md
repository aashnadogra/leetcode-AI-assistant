# leetcode-AI-assistant

![Alt text](\demo\ui (1).png)


### How the `/ask` Endpoint Works:

1. **Request Handling**:
    - The function is decorated with `@app.post("/ask")`, making it respond to HTTP POST requests at the `/ask` path
    - It expects to receive data in the format defined by the `Query` class (which contains `url` and `doubt` fields)
2. **Prompt Construction**:
    - Creates a templated prompt string that:
        - Identifies the LeetCode problem URL
        - Includes the user's specific doubt/question
        - Gives instructions to the AI to provide hints rather than direct solutions
        - Encourages the AI to guide the user to think critically
3. **AI Model Interaction**:
    - Initializes the Gemini 1.5 Flash model
    - Sends the constructed prompt to the model via `model.generate_content(prompt)`
    - The model processes the prompt and returns a text response
4. **Response Handling**:
    - Returns a JSON object with the AI's response text in the `response` field
    - If any exception occurs during this process, it raises an HTTP 500 error with the exception details
5. **Error Handling**:
    - Catches any exceptions that might occur during processing
    - Returns appropriate HTTP error status and message

### How the `/nlp` Endpoint Works:

1. **Request Handling**:
    - Responds to HTTP POST requests at the `/nlp` path
    - Expects data in the `TextInput` format, which contains a `text` field with the content to analyze
2. **Text Analysis Setup**:
    - Defines a list of keywords that might indicate important sentences (`important`, `key idea`, etc.)
    - Uses spaCy (loaded earlier as `nlp = spacy.load("en_core_web_sm")`) to process the text
3. **Sentence Extraction**:
    - Processes the input text with spaCy, which divides it into sentences and tokens
    - Filters sentences to keep only those containing any word from the `keyword_list`
    - Uses a list comprehension to iterate through all sentences and check if they contain these keywords
4. **Fallback Mechanism**:
    - If no sentences with keywords are found, it takes the first two sentences from the document
    - This ensures the function always returns something useful, even if no explicit "important" markers are found
5. **Response Formatting**:
    - Joins the selected key sentences with spaces
    - Returns them in a JSON object with the key `key_sentences`

## How These Functions Work Together

In the overall application flow:

1. When a user sends a message in the chat:
    - The frontend calls the `/ask` endpoint to get an AI response
    - If the response is long (over 250 characters), it may call the `/nlp` endpoint to extract the key sentences
    - If the response is long but the user used the word “explain” then no changes are made to the response and a detailed answer is provided
2. The `/nlp` function acts as a summarization tool that:
    - Helps keep the conversation concise
    - Prioritizes sentences explicitly marked as important
    - Falls back to taking the first few sentences when no explicit markers are found

This two-step process allows the application to:

1. Generate comprehensive, helpful responses using the AI model
2. Automatically condense those responses to maintain a focused conversation

- **Problem-Specific Guidance**:
    - The `promptSelector.js` file contains logic to detect what type of problem the user is working on (arrays, trees, dynamic programming, etc.) using the `promptTemplates.js` file.
    - Without this, the AI would give generic advice rather than specialized guidance for specific algorithm types
- **Dynamic Response Adaptation**:
    - The system adjusts hint levels (gentle → moderate → direct) based on conversation progress
    - This creates a scaffolded learning experience that wouldn't exist without these modules
- **Structured Prompt Engineering**:
    - The frontend constructs specialized prompts like this:
        
        ```jsx
        javascript
        Copy
        let promptPrefix = `You are a helpful and encouraging LeetCode mentor.
        Your goal is to guide the student through solving the problem themselves, not just give away the answer.
        Keep your responses concise - 1-3 sentences when possible.
        Current teaching stage: ${promptInfo.stage}.
        Guidance level: ${promptInfo.hintLevel}.
        
        Use this guidance approach: ${promptInfo.promptTemplate}`;
        
        ```
        
    - This specialized prompt engineering comes directly from these modules
- **Conversation Stage Tracking**:
    - The system detects what stage the learner is in (introduction, hint, walkthrough, etc.)
    - This allows targeted guidance appropriate to where they are in the problem-solving journey
