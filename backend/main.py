from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Load and configure Gemini API Key
API_KEY = ""  
genai.configure(api_key=API_KEY)

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
