"use client"

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiUser, FiMessageSquare, FiX } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you with Ecovision today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      const response = await axios.post('https://ecovision-backend-five.vercel.app/ai-chat', {
        message: input,
        context: "Ecovision is an environmental organization offering volunteer programs, donations, and sustainability initiatives."
      });
  
      const fullText: string = response.data.response;
      let aiResponse = '';
  
      // Add initial empty assistant message to simulate typing
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
  
      for (let i = 0; i < fullText.length; i++) {
        aiResponse += fullText[i];
  
        // Update the last message with progressively added content
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: aiResponse }
        ]);
  
        await new Promise(resolve => setTimeout(resolve, 20)); // typing speed
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "Sorry, I'm having trouble responding. Please try again later." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-96 h-[630px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-teal-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FiMessageSquare className="text-lg" />
              <h3 className="font-semibold">Ecovision Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                >
                  <div className="flex items-center mb-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${message.role === 'user' ? 'bg-green-700' : 'bg-gray-300'}`}>
                      {message.role === 'user' ? (
                        <FiUser className="text-white text-xs" />
                      ) : (
                        <FiMessageSquare className="text-gray-600 text-xs" />
                      )}
                    </div>
                    <span className="text-xs font-medium">
                      {message.role === 'user' ? 'You' : 'Ecovision AI'}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`p-2 rounded-full ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
              >
                <FiSend className="text-lg" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
        >
          <FiMessageSquare className="text-3xl" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;