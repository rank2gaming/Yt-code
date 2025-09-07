import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { SendIcon } from './icons';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const aiRef = useRef<GoogleGenAI | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !aiRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        aiRef.current = ai;
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: 'You are a friendly and helpful shopping assistant for an e-commerce store called YBT Store. Your goal is to help users find products, answer questions about products, and provide recommendations. You have access to the following product categories: Headphones, Mobiles, Laptops, Accessories, Fashion, Home Goods, Books, Sports, Toys, Beauty. Be concise and helpful in your responses.',
          },
        });

        if (messages.length === 0) {
            setMessages([
              { sender: 'ai', text: "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?" }
            ]);
        }
      } catch (error) {
        console.error("Gemini initialization error:", error);
        setMessages(prev => {
          if (prev.find(m => m.text.startsWith("Sorry"))) return prev;
          return [...prev, { sender: 'ai', text: "Sorry, the AI assistant is currently unavailable." }];
        });
      }
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300); // Focus input after transition
    }
  }, [isOpen, messages.length]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);


  const handleSendMessage = async () => {
    const chat = chatRef.current;
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage, { sender: 'ai', text: '' }]);
    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    try {
      const responseStream = await chat.sendMessageStream({ message: messageToSend });

      for await (const chunk of responseStream) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessageIndex = newMessages.length - 1;
          newMessages[lastMessageIndex] = {
            ...newMessages[lastMessageIndex],
            text: newMessages[lastMessageIndex].text + chunk.text
          };
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '85vh' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-heading"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
            <h2 id="chatbot-heading" className="text-lg font-bold text-gray-800 dark:text-gray-200">AI Assistant</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="Close chat">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.text === '' && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-gray-500 dark:bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                        <span className="w-2 h-2 bg-gray-500 dark:bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-2 h-2 bg-gray-500 dark:bg-zinc-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products..."
                className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-black dark:text-white dark:placeholder-zinc-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                aria-label="Send message"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;