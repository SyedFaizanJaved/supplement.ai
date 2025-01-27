import { supabase } from "../components/integrations/supabase/client";

export const fetchChatHistory = async (shouldFetch = true) => {
  if (!shouldFetch) return [];
  
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .is('user_id', null)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Error fetching chat history:', error);
    return null;
  }

  return data;
};

export const persistMessage = async (message) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  try {
    const { error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        message: message.content,
        role: message.role,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error persisting message:', error);
  }
};