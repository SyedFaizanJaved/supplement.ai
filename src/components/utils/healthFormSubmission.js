import { supabase } from "../integrations/supabase/client"; 

export const submitHealthFormData = async (data) => {
  try {
    // Convert medical conditions array to string array for database storage
    const medicalConditionsForDb = data.medicalConditions.map(
      (condition) =>
        condition.specification
          ? `${condition.condition} - ${condition.specification}`
          : condition.condition
    );

    const { error } = await supabase.from("pending_health_profiles").insert({
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      age: parseInt(data.age),
      gender: data.gender,
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
      activity_level: data.activityLevel,
      medical_conditions: medicalConditionsForDb,
      allergies: data.allergies,
      current_medications: data.currentMedications,
      health_goals: data.healthGoals.join(", "),
      monthly_supplement_budget: parseFloat(data.monthlyBudget),
      sleep_hours: parseFloat(data.sleepHours),
      smoking_status: data.smokingStatus,
      alcohol_consumption: data.alcoholConsumption,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error submitting health form data:", error);
    throw new Error(error.message || "Failed to submit health form data");
  }
};