import axios from "axios";
import API_URL from "../config";

const healthGoalDetails = {
  weight_management: {
    name: "Weight Management",
    description: "Support healthy weight goals",
    category: "fitness",
  },
  energy_focus: {
    name: "Energy & Focus",
    description: "Improve daily energy levels and mental clarity",
    category: "wellness",
  },
  immune_support: {
    name: "Immune Support",
    description: "Strengthen immune system function",
    category: "wellness",
  },
  sleep_stress: {
    name: "Sleep & Stress",
    description: "Better sleep quality and stress management",
    category: "fitness",
  },
  fitness_performance: {
    name: "Fitness Performance",
    description: "Enhance workout results and recovery",
    category: "fitness",
  },
  mental_health: {
    name: "Mental Health",
    description: "Support cognitive function and emotional well-being",
    category: "wellness",
  },
  hormone_balance: {
    name: "Hormone Balance",
    description: "Optimize hormone levels naturally",
    category: "nutrition",
  },
  longevity: {
    name: "Longevity",
    description: "Support healthy aging and cellular health",
    category: "wellness",
  },
  chronic_conditions: {
    name: "Manage Chronic Conditions",
    description: "Support overall health with existing conditions",
    category: "wellness",
  },
  beauty: {
    name: "Beauty & Aesthetics",
    description: "Support skin health and natural beauty from within",
    category: "nutrition",
  },
};

export const registerUser = async (formData) => {
  const requiredFields = [
    "email",
    "password",
    "firstName",
    "lastName",
    "phoneNumber",
    "age",
    "gender",
    "height",
    "weight",
  ];

  for (const field of requiredFields) {
    if (
      !formData[field] ||
      (typeof formData[field] === "string" && formData[field].trim() === "")
    ) {
      throw new Error(`${field} is required`);
    }
  }

  const predefinedGoals = (formData.healthGoals || []).map((goalKey) => {
    return healthGoalDetails[goalKey] || {
      name: goalKey,
      description: "",
      category: "wellness",
    };
  });

  const customGoals = (formData.otherHealthGoals || []).map((goal) => ({
    name: goal,
    description: "",
    category: "",
  }));

  const userGoals = [...predefinedGoals, ...customGoals];

  const transformedMedicalConditions = (formData.medicalConditions || []).map(
    (condition) => {
      if (condition.specification) {
        return `${condition.condition} - ${condition.specification}`;
      }
      return condition.condition;
    }
  );

  const heightFeet = Math.floor(formData.height / 12);
  const heightInches = formData.height % 12;

  const payload = {
    email: formData.email,
    password: formData.password,
    first_name: formData.firstName,
    last_name: formData.lastName,
    phone_number: formData.phoneNumber,
    user_goals: userGoals.map((goal) => ({
      name: goal.name,
      description: goal.description,
      category: goal.category,
      target: 1, 
      progress: 0, 
    })),
    age: parseInt(formData.age),
    gender: formData.gender === "male" ? "M" : "F",
    height_in_feet: parseFloat(heightFeet),
    height_in_inches: heightInches,
    weight: parseFloat(formData.weight),
    activity_level: mapActivityLevel(formData.activityLevel),
    allergies: formData.allergies,
    medical_conditions: transformedMedicalConditions,
    current_medications: formData.currentMedications,
    diet_restriction: mapDietType(formData.dietType),
    smoking_status: mapSmokingStatus(formData.smokingStatus),
    alcohol_consumption: mapAlcoholConsumption(formData.alcoholConsumption),
    monthly_budget: mapBudget(formData.monthlyBudget),
    blood_work_test:
      (formData.bloodWorkFiles || []).length > 0
        ? formData.bloodWorkFiles
        : null,
    genetic_test:
      (formData.geneticTestFiles || []).length > 0
        ? formData.geneticTestFiles
        : null,
  };

  // Add family or referral code if provided.
  if (formData.family && formData.family.length > 0) {
    payload.family = formData.family.map((member) => ({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
    }));
  } else if (formData.referralCode) {
    payload.referral_code = formData.referralCode;
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/v1/auth/register/`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message ||
        "Registration failed, possibly due to duplicate email or phone number."
      );
    }
    throw new Error("Network error occurred");
  }
};

const mapActivityLevel = (level) => {
  const mapping = {
    sedentary: "Sedentary",
    moderate: "Moderately Active",
    active: "Active",
    very_active: "Very Active",
  };
  return mapping[level] || level;
};

const mapDietType = (diet) => {
  const mapping = {
    healthy_balanced: "Healthy",
    vegan_vegetarian: "Vegan/Vegetarian",
    animal_based: "Animal Based",
    keto: "Keto",
    balanced: "A fair average diet",
    processed_food: "Fast/Processed Food Often",
  };
  return mapping[diet] || diet;
};

const mapSmokingStatus = (status) => {
  const mapping = {
    non_smoker: "Non-smoker",
    former_smoker: "Former smoker",
    current_smoker: "Current smoker",
    vaper: "Vaper",
  };
  return mapping[status] || status;
};

const mapAlcoholConsumption = (consumption) => {
  const mapping = {
    none: "None",
    occasional: "Occasional",
    moderate: "Moderate",
    frequent: "Frequent",
  };
  return mapping[consumption] || consumption;
};

const mapBudget = (budget) => {
  const mapping = {
    less_100: "less than $100/month",
    "100_200": "$100-200/month",
    "200_300": "$200-300/month",
    more_300: "more than $300/month",
  };
  return mapping[budget] || budget;
};
