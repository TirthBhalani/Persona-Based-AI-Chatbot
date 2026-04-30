import { useState, useRef, useEffect } from 'react';
import './index.css';
import { PERSONAS, SUGGESTIONS } from './constants';

function App() {
  const [activePersona, setActivePersona] = useState('anshuman');
  const [conversations, setConversations] = useState({
    anshuman: [],
    kshitij: [],
    abhimanyu: []
  });
  const messages = conversations[activePersona] || [];
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handlePersonaSwitch = (personaId) => {
    if (personaId !== activePersona) {
      setActivePersona(personaId);
      setInputValue('');
    }
  };

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    const currentHistory = [...messages, userMsg];
    
    setConversations(prev => ({
      ...prev,
      [activePersona]: currentHistory
    }));
    
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: activePersona,
          message: text,
          history: messages.map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      });

      const data = await response.json();
      if (data.reply) {
        setConversations(prev => ({
          ...prev,
          [activePersona]: [...currentHistory, { role: 'bot', content: data.reply }]
        }));
      } else {
        setConversations(prev => ({
          ...prev,
          [activePersona]: [...currentHistory, { role: 'bot', content: "Error: " + (data.error || "Something went wrong.") }]
        }));
      }
    } catch (error) {
      setConversations(prev => ({
        ...prev,
        [activePersona]: [...currentHistory, { role: 'bot', content: "Failed to connect to the server." }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessageContent = (content) => {
    // Extract <thinking> blocks to style them differently
    const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
    let thinkingText = null;
    let mainText = content;

    if (thinkingMatch) {
      thinkingText = thinkingMatch[1].trim();
      mainText = content.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
    }

    return (
      <>
        {thinkingText && <div className="thinking-block">Thinking: {thinkingText}</div>}
        <div style={{ whiteSpace: 'pre-wrap' }}>{mainText}</div>
      </>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Scaler AI Personas</h1>
        <div className="persona-switcher">
          {PERSONAS.map(p => (
            <button
              key={p.id}
              className={`persona-btn ${activePersona === p.id ? `active ${p.id}` : ''}`}
              onClick={() => handlePersonaSwitch(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>

      <main className="chat-layout">
        {messages.length === 0 && (
          <div className="suggestions-container">
            {SUGGESTIONS[activePersona].map((sug, i) => (
              <div 
                key={i} 
                className="suggestion-chip"
                onClick={() => handleSend(sug)}
              >
                {sug}
              </div>
            ))}
          </div>
        )}

        <div className="chat-window">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
              Start a conversation with {PERSONAS.find(p => p.id === activePersona).label}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              {m.role === 'bot' ? parseMessageContent(m.content) : m.content}
            </div>
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-container">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask ${PERSONAS.find(p => p.id === activePersona).label} anything...`}
            />
            <button 
              className="send-btn" 
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
