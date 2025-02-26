import axios from "axios";
import API_URL from "../config";
import { toast } from "../components/hooks/use-toast";

const healthGoalDetails = {
  weight_management: {
    name: "Weight Management",
    description: "Support healthy weight goals",
  },
  energy_focus: {
    name: "Energy & Focus",
    description: "Improve daily energy levels and mental clarity",
  },
  immune_support: {
    name: "Immune Support",
    description: "Strengthen immune system function",
  },
  sleep_stress: {
    name: "Sleep & Stress",
    description: "Better sleep quality and stress management",
  },
  fitness_performance: {
    name: "Fitness Performance",
    description: "Enhance workout results and recovery",
  },
  mental_health: {
    name: "Mental Health",
    description: "Support cognitive function and emotional well-being",
  },
  hormone_balance: {
    name: "Hormone Balance",
    description: "Optimize hormone levels naturally",
  },
  longevity: {
    name: "Longevity",
    description: "Support healthy aging and cellular health",
  },
  chronic_conditions: {
    name: "Manage Chronic Conditions",
    description: "Support overall health with existing conditions",
  },
  beauty: {
    name: "Beauty & Aesthetics",
    description: "Support skin health and natural beauty from within",
  },
};

export const registerUser = async (formData) => {
  // Validate required fields.
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

  // Build the user goals array.
  const predefinedGoals = (formData.healthGoals || []).map((goalKey) => {
    if (healthGoalDetails[goalKey]) {
      return {
        name: healthGoalDetails[goalKey].name,
        description: healthGoalDetails[goalKey].description,
      };
    }
    // Fallback if the key is not found.
    return {
      name: goalKey,
      description: "",
    };
  });
  const customGoals = (formData.otherHealthGoals || []).map((goal) => ({
    name: goal,
    description: "",
  }));
  const userGoals = [...predefinedGoals, ...customGoals];

  if (userGoals.length === 0) {
    throw new Error("At least one user goal is required.");
  }

  // Transform medical conditions if needed.
  const medicalConditions = (formData.medicalConditions || []).map(
    (condition) =>
      condition.specification
        ? `${condition.condition} - ${condition.specification}`
        : condition.condition
  );

  // Convert height from centimeters to feet and inches.
  const totalInches = Math.round(Number(formData.height) / 2.54);
  const heightFeet = Math.floor(totalInches / 12);
  const heightInches = totalInches % 12;

  // console.log("Form Data in registerUser:", formData);

  // Create a new FormData object.

  const payload = new FormData();
  payload.append("email", formData.email);
  payload.append("password", formData.password);
  payload.append("first_name", formData.firstName);
  payload.append("last_name", formData.lastName);
  payload.append("phone_number", formData.phoneNumber);
  payload.append("user_goals", JSON.stringify(userGoals));
  payload.append("age", parseInt(formData.age, 10));
  payload.append("gender", formData.gender === "male" ? "M" : "F");
  payload.append("height_in_feet", heightFeet);
  payload.append("height_in_inches", heightInches);
  payload.append("weight", parseFloat(formData.weight));
  payload.append("activity_level", mapActivityLevel(formData.activityLevel));
  payload.append("allergies", JSON.stringify(formData.allergies));
  payload.append("medical_conditions", JSON.stringify(medicalConditions));
  payload.append("current_medications", JSON.stringify(formData.currentMedications));
  payload.append("diet_restriction", mapDietType(formData.dietType));
  payload.append("smoking_status", mapSmokingStatus(formData.smokingStatus));
  payload.append("alcohol_consumption", mapAlcoholConsumption(formData.alcoholConsumption));
  payload.append("monthly_budget", mapBudget(formData.monthlyBudget));
  payload.append("average_sleep", formData.sleepHours);
  payload.append("concerns", formData.concerns);
  payload.append("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

  if (formData.bloodWorkFiles && formData.bloodWorkFiles.length > 0) {
    const bloodFile = formData.bloodWorkFiles[0];
    console.log("Appending blood work file:", bloodFile);
    payload.append("blood_work_test", bloodFile, bloodFile.name);
  } else {
    console.log("No blood work file found.");
  }

  if (formData.geneticTestFiles && formData.geneticTestFiles.length > 0) {
    const geneticFile = formData.geneticTestFiles[0];
    console.log("Appending genetic test file:", geneticFile);
    payload.append("genetic_test", geneticFile, geneticFile.name);
  } else {
    console.log("No genetic test file found.");
  }

  if (formData.family && formData.family.length > 0) {
    payload.append("family", JSON.stringify(formData.family));
  } else if (formData.referralCode) {
    payload.append("referral_code", formData.referralCode);
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/v1/auth/register/`,
      payload
    );
    return response.data;
  } catch (error) {
    const extractValues = (obj) => {
      return Object.values(obj).flatMap((value) =>
        typeof value === "object" && value !== null
          ? extractValues(value)
          : value
      );
    };

    const errorValues = extractValues(error.response.data);
    console.log("errorValues", errorValues);

    throw new Error(errorValues[0]);
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
