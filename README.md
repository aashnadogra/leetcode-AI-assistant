# leetcode-AI-assistant

![Alt text](demo/ui%20(1).png)

# Project Setup Guide

Follow these steps to set up and run the project locally.

## Clone the Repository  
Open a terminal and run:

```sh
git clone https://github.com/aashnadogra/leetcode-AI-assistant.git
cd leetcode-AI-assistant.git
```

## Frontend Setup
```sh
cd frontend
npm install
npm start
```

## Backend Setup
```sh
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
## Generate API Key for Gemini

Visit Google AI Studio.
Generate an API key for Gemini.
Copy the API key.

## Set Up .env File
Create a .env file in the backend directory and add the following line:
```sh
GEMINI_API_KEY="your_key_here"
```
Replace "your_key_here" with the API key you generated.

## Run the Backend
```sh
uvicorn main:app --reload
```
This will start the FastAPI backend.


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

1. When a user types a URL and starts chat:
    - The url is sent to LLM and it understands the problems being talked about
    - **Problem-Specific Guidance**: The promptSelector.js identifies the problem type from the description returned and is not displayed to user yet.
    - **Structured Prompt Engineering**: Then as chat progresses promptSelector.js selects custom prompts from promptTemplates.js which has a full set of suggested walkthroughs, hints, mistakes suggested for problem types and a custom prompt is generated which includes detail of the problem and how the LLM can respond to it
    - **Dynamic Response Adaptation**: This prompt is then sent which helps the AI model understand the level with which it needs to answer plus some general hints and walkthrough example on which it could base it's answer

2. When a user sends a message in the chat:
    - The frontend calls the `/ask` endpoint to get an AI response
    - If the response is long (over 250 characters), it may call the `/nlp` endpoint to extract the key sentences
    - If the response is long but the user used the word “explain” then no changes are made to the response and a detailed answer is provided

3. The `/nlp` function acts as a summarization tool that:
    - Helps keep the conversation concise
    - Prioritizes sentences explicitly marked as important
    - Falls back to taking the first few sentences when no explicit markers are found


In all this model walks the user through the solution with gradually increasing hints based on keywords used by user and chat history. It undersatands according the the chat length if a gentle or direct hint is to be given and using the promptSelector it is able to give good prompts to Gemini model so it can respond accordingly without directly solving the question. 
