import { supabase } from "../integrations/supabase/client";

export const useAIChat = () => {
  const processAIResponse = async (message, userId) => {
    console.log('Sending message to search-supplements function:', message);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-supplements', {
        body: { 
          query: message,
          userId: userId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Received response from search-supplements:', data);

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error processing AI response:', error);
      throw new Error('Failed to process your request. Please try again.');
    }
  };

  return {
    processAIResponse
  };
};