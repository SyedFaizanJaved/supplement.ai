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
    .max(50, "First name must be less than 50 characters")
    .nonempty("First name is required"),
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters")
    .nonempty("Last name is required"),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .nonempty("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be less than 12 digits")
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      passwordRegex.uppercase,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      passwordRegex.lowercase,
      "Password must contain at least one lowercase letter"
    )
    .regex(passwordRegex.number, "Password must contain at least one number")
    .regex(
      passwordRegex.special,
      "Password must contain at least one special character"
    ),
  age: z
    .string()
    .nonempty("Age is required")
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
    .refine(
      (val) => Number(val) > 40 && Number(val) <= 600,
      "Weight must be in between 40lbs to 600lbs"
    ),
  activityLevel: z.enum(["sedentary", "moderate", "active", "very_active"]),
  medicalConditions: z.array(medicalConditionSchema).default([]),
  allergies: z.array(z.string()).default([]),
  currentMedications: z.array(z.string()).default([]),
  hasBloodwork: z.boolean().default(false),
  hasGeneticTesting: z.boolean().default(false),
  healthGoals: z.array(z.string()).min(1, "Select at least one health goal"),
  otherHealthGoals: z
    .array(z.string().min(2, "Custom goal must be at least 2 characters"))
    .optional(),
  monthlyBudget: z.string().min(1, "Please select a monthly budget"),
  dietType: z
    .enum([
      "vegan_vegetarian",
      "animal_based",
      "keto",
      "processed_food",
      "balanced",
      "healthy_balanced",
    ])
    .optional(),
  sleepHours: z
    .string()
    .nonempty("Sleep hours is required")
    .refine((val) => !isNaN(Number(val)), "Sleep hours must be a number")
    .refine(
      (val) => Number(val) >= 0 && Number(val) <= 24,
      "Sleep hours must be between 0 and 24"
    ),
  smokingStatus: z.enum([
    "non_smoker",
    "former_smoker",
    "current_smoker",
    "vaper",
  ]),
  alcoholConsumption: z.enum(["none", "occasional", "moderate", "frequent"]),
});

export const healthFormSchemaType = healthFormSchema;
