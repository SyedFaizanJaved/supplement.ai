import { z } from "zod";

const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

const medicalConditionSchema = z.object({
  condition: z.string(),
  specification: z.string().optional(),
});

export const healthFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(passwordRegex.uppercase, "Password must contain at least one uppercase letter")
    .regex(passwordRegex.lowercase, "Password must contain at least one lowercase letter")
    .regex(passwordRegex.number, "Password must contain at least one number")
    .regex(passwordRegex.special, "Password must contain at least one special character"),
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Age must be a number")
    .refine(
      (val) => Number(val) >= 18 && Number(val) <= 120,
      "Age must be between 18 and 120"
    ),
  gender: z.enum(["male", "female"]),
  height: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Height must be a number")
    .refine((val) => Number(val) > 0, "Height must be greater than 0"),
  weight: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Weight must be a number")
    .refine((val) => Number(val) > 0, "Weight must be greater than 0"),
  activityLevel: z.enum(["sedentary", "moderate", "active", "athlete"]),
  medicalConditions: z.array(medicalConditionSchema).default([]),
  allergies: z.array(z.string()).default([]),
  currentMedications: z.array(z.string()).default([]),
  hasBloodwork: z.boolean().default(false),
  hasGeneticTesting: z.boolean().default(false),
  healthGoals: z.array(z.string()).min(1, "Please select at least one health goal"),
  otherHealthGoals: z.array(z.string()).optional(),
  monthlyBudget: z.string().min(1, "Please select a monthly budget"),
  dietType: z.enum([
    "vegan_vegetarian",
    "animal_based",
    "keto",
    "processed_food",
    "fair_average",
    "healthy_balanced"
  ]).optional(),
  sleepHours: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Sleep hours must be a number")
    .refine(
      (val) => Number(val) >= 0 && Number(val) <= 24,
      "Sleep hours must be between 0 and 24"
    ),
  smokingStatus: z.enum(["non_smoker", "former_smoker", "current_smoker", "vaper"]),
  alcoholConsumption: z.enum(["none", "occasional", "moderate", "frequent"]),
});

export const healthFormSchemaType = healthFormSchema;