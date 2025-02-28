from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import spacy
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY") 
if not API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")
genai.configure(api_key=API_KEY)

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
nlp = spacy.load("en_core_web_sm")
# Request body model
class Query(BaseModel):
    url: str
    doubt: str

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running!"}

@app.post("/ask")
async def ask_gpt(query: Query):
    try:
        prompt = f"""
        A user is struggling with a coding problem from LeetCode: {query.url}.
        Their doubt: "{query.doubt}"
        
        Provide hints, step-by-step guidance, and similar problem references.
        DO NOT give a direct solution. Encourage the user to think critically.
        """

        model = genai.GenerativeModel("models/gemini-1.5-flash")
        response = model.generate_content(prompt)

        return {"response": response.text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Define input data model
class TextInput(BaseModel):
    text: str
    
@app.post("/nlp")
async def extract_key_sentences(input_data: TextInput):
    text = input_data.text
    keyword_list = ["important", "key idea", "main concept", "critical"]
    
    doc = nlp(text)
    key_sentences = [sent.text for sent in doc.sents if any(word in sent.text.lower() for word in keyword_list)]
    
    if not key_sentences:
        key_sentences = [sent.text for sent in list(doc.sents)[:2]]

    return {"key_sentences": " ".join(key_sentences)}
