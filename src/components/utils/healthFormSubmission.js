import { supabase } from "../integrations/supabase/client";

export const submitHealthFormData = async (formData) => {
  try {
    console.log('Starting form submission with data:', formData);

    // Convert strings to arrays by splitting on commas and trimming whitespace
    const convertToArray = (str) => {
      // Handle null/undefined/non-string inputs
      if (str == null) return [];
      
      // Ensure input is converted to string
      const strValue = String(str).trim();
      
      return strValue ? strValue.split(',').map(item => item.trim()) : [];
    };

    // First clean up expired profiles
    await supabase
      .from('pending_health_profiles')
      .delete()
      .lt('expires_at', new Date().toISOString());

    // Check for existing non-expired profile with this email
    const { data: existingProfiles, error: checkError } = await supabase
      .from('pending_health_profiles')
      .select('id')
      .eq('email', formData.email)
      .gt('expires_at', new Date().toISOString());

    if (checkError) {
      console.error('Error checking existing profiles:', checkError);
      throw new Error('Error checking existing profiles');
    }

    if (existingProfiles && existingProfiles.length > 0) {
      throw new Error('An account with this email already exists');
    }

    // Insert new profile
    const { data, error } = await supabase
      .from('pending_health_profiles')
      .insert([
        {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activity_level: formData.activityLevel,
          medical_conditions: convertToArray(formData.medicalConditions),
          allergies: convertToArray(formData.allergies),
          current_medications: convertToArray(formData.currentMedications),
          health_goals: formData.healthGoals,
          monthly_supplement_budget: parseFloat(formData.monthlyBudget),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create profile');
    }

    console.log('Successfully created profile:', data.id);
    return data;

  } catch (error) {
    console.error('Submission error:', error);
    throw error;
  }
};