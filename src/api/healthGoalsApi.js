import { supabase } from "../components/integrations/supabase/client";

export const addHealthGoal = async (goal) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from('health_goals')
    .insert({
      user_id: user.id,
      ...goal,
    });

  if (error) throw error;
};