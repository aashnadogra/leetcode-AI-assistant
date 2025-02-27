import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './LandingPage.css';

const LandingPage = () => {
  // URL and initial doubt input
  const [url, setUrl] = useState("");
  const [initialDoubt, setInitialDoubt] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Chat state
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Reference for auto-scrolling chat
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
      
      // Start chat with welcoming message
      const systemMessage = {
        id: Date.now(),
        sender: 'assistant',
        text: "Hey there! I'll help you solve this LeetCode problem. What's giving you trouble?",
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
    
    try {
      // Send the message to backend
      const res = await axios.post("http://127.0.0.1:8000/ask", {
        url,
        doubt: messageText,
        context: messages.map(m => `${m.sender}: ${m.text}`).join('\n')
      });
      
      // Process response to make it more conversational and shorter
      const rawResponse = res.data.response;
      let processedResponse = rawResponse;
      
      // If response is too long, trim it and make it more concise
      if (rawResponse.length > 500) {
        // Extract key points and create a shorter response
        const sentences = rawResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        if (sentences.length > 3) {
          // Take first sentence and a couple key sentences from the middle/end
          processedResponse = sentences[0] + '. ' + 
                             sentences[Math.floor(sentences.length / 2)] + '. ' +
                             sentences[sentences.length - 1] + '.';
        }
      }
      
      // Add conversational elements
      const conversationalPhrases = [
        "Let's think about this...",
        "Here's what I'd suggest:",
        "Have you considered this approach?",
        "Let me simplify this for you.",
        "Think of it this way:",
        "The key insight here is:",
        "Let's break this down:",
        "I see what's happening.",
        "Try to visualize it like this:"
      ];
      
      const randomPhrase = conversationalPhrases[Math.floor(Math.random() * conversationalPhrases.length)];
      processedResponse = randomPhrase + " " + processedResponse;
      
      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: processedResponse,
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

  // Function to add follow-up question based on conversation context
  const addFollowUpQuestion = () => {
    const followUps = [
      "Need me to explain any part of this further?",
      "Does that make sense?",
      "Want to try implementing this approach?",
      "Shall we go through another example?",
      "What part are you stuck on?",
      "Any questions about this solution?"
    ];
    
    const randomFollowUp = followUps[Math.floor(Math.random() * followUps.length)];
    
    // Only add follow-up every few messages to avoid being annoying
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'assistant' && messages.length % 3 === 0) {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now(),
          sender: 'assistant',
          text: randomFollowUp,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  // Add occasional follow-up questions
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'assistant') {
      const timer = setTimeout(() => {
        addFollowUpQuestion();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

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
                      {message.text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
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