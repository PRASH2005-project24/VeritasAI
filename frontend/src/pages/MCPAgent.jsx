import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, MessageCircle, Zap } from 'lucide-react';

const MCPAgent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm the VeritasAI assistant. I can help you with certificate verification queries, fraud statistics, and system information. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQueries = [
    "Show fraud stats for last 7 days",
    "How many certificates were verified today?",
    "Verify this certificate",
    "What are the most common fraud patterns?"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    // Simulate bot response
    const botResponse = {
      id: messages.length + 2,
      type: 'bot',
      content: `I understand you're asking about "${inputMessage}". In a fully implemented system, I would process this query and provide relevant information about certificate verification, fraud statistics, or system analytics.`,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage, botResponse]);
    setInputMessage('');
  };

  const handleQuickQuery = (query) => {
    setInputMessage(query);
  };

  return (
    <div className="min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-12">
          <Bot className="h-16 w-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">VeritasAI Assistant</h1>
          <p className="text-xl text-white/80">
            Natural language queries for certificate verification and analytics
          </p>
        </div>

        {/* Chat Interface */}
        <div className="glass-card p-6 mb-6">
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="Ask me anything about certificate verification..."
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Query Chips */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            Quick Queries
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuery(query)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center">
            <MessageCircle className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Natural Language</h3>
            <p className="text-sm text-white/70">Ask questions in plain English</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Bot className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">AI Powered</h3>
            <p className="text-sm text-white/70">Intelligent responses and insights</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Instant Answers</h3>
            <p className="text-sm text-white/70">Real-time system information</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MCPAgent;