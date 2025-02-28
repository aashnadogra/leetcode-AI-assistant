import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './LandingPage.css';
import promptSelector from './promptSelector.js';

const LandingPage = () => {
  const [url, setUrl] = useState("");
  const [initialDoubt, setInitialDoubt] = useState("");
  const [loading, setLoading] = useState(false);
 
  // Chat state
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  
  // Problem context state
  const [problemDescription, setProblemDescription] = useState("");
  const [detectedProblemType, setDetectedProblemType] = useState(null);
  const [hintLevel, setHintLevel] = useState("gentle"); // gentle, moderate, direct
  const [hasAskedProblemType, setHasAskedProblemType] = useState(false);
  
  // Reference for auto-scrolling chat
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Extract key sentences to make responses more concise
  const extractSentences = async (inputText) => {
    try {
        const response = await fetch("http://localhost:8000/nlp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputText }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response from backend");
        }

        let processedResponse = await response.json(); // ✅ Convert response to JSON

        if (processedResponse.length > 250 && !inputText.toLowerCase().includes("explain")) {
            try {
                const shortenedResponse = await extractSentences(processedResponse);
                if (shortenedResponse) {
                    processedResponse = shortenedResponse;
                }
            } catch (error) {
                console.error("Failed to process response:", error);
            }
        }

        return processedResponse; 

    } catch (error) {
        console.error("Error extracting sentences:", error);
        return null;
    }
};


  // Handle initial form submission
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Make initial API call to get problem context
      const res = await axios.post("http://127.0.0.1:8000/ask", {
        url,
        doubt: "Please analyze this problem briefly.",
      });
      
      // Store problem description for context
      setProblemDescription(res.data.response);
      
      // Detect problem type from description but don't reveal it
      const problemType = promptSelector.detectProblemType(res.data.response);
      setDetectedProblemType(problemType);
      
      // Start chat with welcoming message - don't mention problem type
      const systemMessage = {
        id: Date.now(),
        sender: 'assistant',
        text: "Hey there! I'll help you solve this problem. What specific part is giving you trouble?",
        timestamp: new Date().toISOString()
      };
      
      setMessages([systemMessage]);
      setChatStarted(true);
      
      // If user provided an initial doubt, add it to the conversation
      if (initialDoubt.trim()) {
        setTimeout(() => {
          handleSendMessage(initialDoubt, true);
        }, 500);
      }
      
    } catch (error) {
      console.error("API call error:", error);
      alert("Error initializing chat. Please try again.");
    }
    
    setLoading(false);
  };

  // Handle sending a new message in the chat
  const handleSendMessage = async (text = null, isInitialDoubt = false) => {
    const messageText = text || currentMessage;
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    if (!isInitialDoubt) setCurrentMessage("");
    
    setLoading(true);
    
    // Update hint level based on conversation progress and user's question
    updateHintLevel(messageText);
    
    // Check if user is asking about problem type
    const isAskingProblemType = messageText.toLowerCase().includes("problem type") || 
                               messageText.toLowerCase().includes("what type") ||
                               messageText.toLowerCase().includes("category");
    
    if (isAskingProblemType) {
      setHasAskedProblemType(true);
    }
    
    try {
      // Get conversation context for prompt construction
      const conversationContext = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      
      // Create structured prompt based on problem type, question, and conversation stage
      const promptInfo = promptSelector.createStructuredPrompt(
        problemDescription, 
        messageText, 
        conversationContext
      );
      
      // Construct model instructions with appropriate guidance template
      let promptPrefix = `You are a helpful and encouraging LeetCode mentor. 
Your goal is to guide the student through solving the problem themselves, not just give away the answer.
Keep your responses concise - 1-3 sentences when possible.
Current teaching stage: ${promptInfo.stage}.
Guidance level: ${promptInfo.hintLevel}.

Use this guidance approach: ${promptInfo.promptTemplate}`;

      // Only mention problem type if user has explicitly asked
      if (hasAskedProblemType && isAskingProblemType) {
        promptPrefix += `\n\nThey're asking about the problem type. You can tell them this appears to be a ${promptInfo.problemType.primaryType} problem, and briefly explain why.`;
      } else {
        promptPrefix += `\n\nDo NOT explicitly mention the problem type (${promptInfo.problemType.primaryType}) unless they specifically ask.`;
      }
      
      promptPrefix += `\n\nNow respond very concisely to the student's question: "${messageText}"`;
      
      // Send the message to backend with structured prompt
      const res = await axios.post("http://127.0.0.1:8000/ask", {
        url,
        doubt: messageText,
        context: conversationContext,
        promptPrefix: promptPrefix
      });
      
      // Process response to make it more concise if needed
      let processedResponse = res.data.response || "";
      
      // Only process longer responses that aren't explicit explanation requests
      if (processedResponse.length > 250 && !messageText.toLowerCase().includes("explain")) {
        try {
          const shortenedResponse = await extractSentences(processedResponse);
          if (shortenedResponse) {
            processedResponse = shortenedResponse;
          }
        } catch (error) {
          console.error("Failed to process response:", error);
          // Continue with original response if processing fails
        }
      }
      
      // Add assistant response with null check
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: processedResponse || "I couldn't process your request. Let's try again.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
    } catch (error) {
      console.error("API call error:", error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'system',
        text: "Sorry, I couldn't process your message. Let's try again?",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
    
    setLoading(false);
  };

  // Update hint level based on conversation progress and question content
  const updateHintLevel = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // Progress hint level based on specific requests or conversation length
    if (messages.length > 8 || 
        lowerQuestion.includes("just tell me") || 
        lowerQuestion.includes("give me the answer") ||
        lowerQuestion.includes("very stuck")) {
      setHintLevel("direct");
    } else if (messages.length > 4 || 
               lowerQuestion.includes("more hint") || 
               lowerQuestion.includes("another hint") ||
               lowerQuestion.includes("still confused")) {
      setHintLevel("moderate");
    } else {
      setHintLevel("gentle");
    }
  };

  // Safe render for message text
  const renderMessageText = (text) => {
    if (!text) return <p>No message content</p>;

    // If text is an object, try to extract the key_sentences field
    if (typeof text === "object" && text.key_sentences) {
        text = text.key_sentences; 
    }

    // Ensure it's now a string before splitting
    if (typeof text !== "string") {
        console.error("Expected a string but got:", text);
        return <p>No message content</p>;
    }

    return text.split('\n').map((line, i) => (
      <p key={i}>{line || ' '}</p>
    ));
};


  return (
    <div className="landing-page">
      <div className="background-overlay"></div>
      
      <div className="content-container">
        <div className="left-content">
          <div className="branding">AASHNA DOGRA</div>
          
          <h1 className="headline">
            AI problem solving assistant
          </h1>
          
          <p className="subheadline">
            Use this AI mentor to discuss approaches and solve leetcode problems. Enter URL and chat with and understand the problem solving approach.
          </p>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon">🧩</div>
              <div className="feature-text">
                <h3>FastAPI</h3>
                <p>Used for backend server and handling API calls with async</p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">💡</div>
              <div className="feature-text">
                <h3>React</h3>
                <p>For friendly UI and javascript for rendering components and state management </p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <h3>Google AI studio</h3>
                <p>To get Gemini API</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="right-content">
          {!chatStarted ? (
            <div className="chat-container">
              <h2 className="card-title">Chat with LeetCode Mentor</h2>
              
              <form onSubmit={handleInitialSubmit} className="chat-form">
                <div className="form-group">
                  <label htmlFor="leetcodeUrl">LeetCode Problem URL</label>
                  <input
                    type="text"
                    id="leetcodeUrl"
                    placeholder="Paste LeetCode problem URL here"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="initialDoubt">What's your question? (optional)</label>
                  <textarea
                    id="initialDoubt"
                    placeholder="E.g., How do I start this problem?"
                    value={initialDoubt}
                    onChange={(e) => setInitialDoubt(e.target.value)}
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Starting Chat..." : "Chat with Mentor"}
                </button>
              </form>
            </div>
          ) : (
            <div className="chat-interface">
              <div className="chat-header">
                <h2>LeetCode Mentor</h2>
                <div className="problem-url">{url.split('/').pop()}</div>
              </div>
              
              <div className="chat-messages">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message ${message.sender}-message`}
                  >
                    <div className="message-content">
                      {renderMessageText(message.text)}
                    </div>
                    <div className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="message assistant-message loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="chat-input">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <textarea
                    placeholder="Ask your question..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  ></textarea>
                  <button type="submit" disabled={loading || !currentMessage.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;