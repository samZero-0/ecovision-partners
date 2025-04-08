"use client"

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiUser, FiMessageSquare, FiX, FiChevronDown } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface QuickPrompt {
  label: string;
  query: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you with Ecovision today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts: QuickPrompt[] = [
    { label: "About Us", query: "Tell me about Ecovision" },
    { label: "How to Donate?", query: "How can I donate to Ecovision?" },
    { label: "Volunteer Programs", query: "What volunteer programs do you offer?" },
    { label: "How to Sign Up?", query: "How do I sign up for Ecovision?" },
    { label: "Pricing", query: "What are your pricing options?" },
    { label: "Sustainability Tips", query: "Share some sustainability tips" }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;
  
    const userMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowPrompts(false);
  
    try {
      const response = await axios.post('https://ecovision-backend-five.vercel.app/ai-chat', {
        message: userInput,
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  const handlePromptClick = (query: string) => {
    handleSubmit(query);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[350px] md:w-96 h-[630px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full">
                <FiMessageSquare className="text-teal-600 text-lg" />
              </div>
              <h3 className="font-semibold text-lg">Ecovision Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {/* Quick Prompts */}
            {showPrompts && messages.length === 1 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <span>Quick Questions</span>
                  <FiChevronDown className="ml-1" />
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt.query)}
                      className="bg-white border border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-left p-3 rounded-lg transition-all text-sm"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${message.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}
                >
                  <div className="flex items-center mb-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${message.role === 'user' ? 'bg-teal-700' : 'bg-teal-100'}`}>
                      {message.role === 'user' ? (
                        <FiUser className="text-white text-xs" />
                      ) : (
                        <FiMessageSquare className="text-teal-600 text-xs" />
                      )}
                    </div>
                    <span className="text-xs font-medium">
                      {message.role === 'user' ? 'You' : 'Ecovision AI'}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 max-w-[80%] border border-gray-100 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {!showPrompts && messages.length > 1 && !isLoading && (
            <div className="px-4 pt-2">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt.query)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 transition-colors"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleFormSubmit} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`p-3 rounded-full ${isLoading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'} text-white transition-colors shadow-md`}
              >
                <FiSend className="text-lg" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-colors"
        >
          <FiMessageSquare className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;