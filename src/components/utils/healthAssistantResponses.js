import React, { useState } from 'react';

const HealthAssistant = () => {
  const [response, setResponse] = useState('');

  const generateResponse = (message, recommendations = '') => {
    const lowercaseMessage = message.toLowerCase();

    // Initial greeting
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return "Hello! I'm your personal health assistant. How can I help you today?";
    }

    // Handle analysis requests
    if (lowercaseMessage.includes('analyze') || lowercaseMessage.includes('health data')) {
      if (!recommendations) {
        return "I'll analyze your health data right away. Give me a moment...";
      }
      return `Based on my analysis of your health data, here's what I found:\n\n${recommendations}\n\nWould you like me to explain any part in more detail?`;
    }

    // Handle supplement plan requests
    if (lowercaseMessage.includes('supplement')) {
      return "I'll check your supplement plan. Your current recommendations are based on your lab results and health profile. Would you like to see the full plan or focus on specific supplements?";
    }

    // Handle progress checking
    if (lowercaseMessage.includes('progress')) {
      return "I'll look at your progress. I can show you trends in your lab results and how they've changed over time. What specific aspect would you like to focus on?";
    }

    // Handle goals
    if (lowercaseMessage.includes('goals')) {
      return "Let's review your health goals. I can help you track your progress and suggest adjustments based on your latest data. What specific goal would you like to discuss?";
    }

    // If recommendations are provided but don't match specific cases above
    if (recommendations) {
      return `Here's what I found from analyzing your health data:\n\n${recommendations}\n\nIs there anything specific you'd like me to explain further?`;
    }

    // Default response for unmatched queries
    return "I understand you're asking about your health. Could you please be more specific about what you'd like to know? I can help with analyzing your health data, reviewing your supplement plan, checking your progress, or discussing your health goals.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    const recommendations = e.target.recommendations?.value || '';
    const generatedResponse = generateResponse(message, recommendations);
    setResponse(generatedResponse);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <input
            type="text"
            id="message"
            name="message"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="recommendations" className="block text-sm font-medium mb-1">
            Recommendations (optional)
          </label>
          <textarea
            id="recommendations"
            name="recommendations"
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Response
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-medium mb-2">Generated Response:</h2>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};

export default HealthAssistant;