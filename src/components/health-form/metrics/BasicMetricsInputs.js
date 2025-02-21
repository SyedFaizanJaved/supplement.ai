import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../ui/form";
import styles from "./BasicMetricsInputs.module.css";

export const BasicMetricsInputs = ({ form }) => {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [heightError, setHeightError] = useState("");

  const updateHeight = (newFeet, newInches) => {
    const f = parseInt(newFeet, 10) || 0;
    const i = parseInt(newInches, 10) || 0;

    if (newInches >= 12) {
      setHeightError("valid inches (0-11)");
      form.setError("height", {
        message: "valid inches (0-11)",
      });
      form.setValue("height", "");
      return;
    }

    if (f > 8 || (f === 8 && i > 0)) {
      setHeightError("Height cannot exceed 8'0\"");
      form.setValue("height", "");
      return;
    } else {
      setHeightError("");
      const totalInches = f * 12 + i;
      const cm = Math.round(totalInches * 2.54);
      form.setValue("height", cm.toString());
    }
  };

  function cmToFeetInches(cm) {
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;

    return { feet, inches };
  }

  React.useEffect(() => {
    const height = form.getValues("height");
    if (!height) return;
    const { feet, inches } = cmToFeetInches(height);
    setFeet(feet);
    setInches(inches);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {/* Age Field with validation */}
        <FormField
          control={form.control}
          name="age"
          rules={{
            max: { value: 110, message: "Age cannot exceed 110 years" },
          }}
          render={({ field }) => (
            <FormItem className={styles.ageField}>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter age"
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    if (parseInt(val, 10) > 110) {
                      form.setError("age", {
                        message: "Age cannot exceed 110 years",
                      });
                    } else {
                      form.clearErrors("age");
                    }
                  }}
                />
              </FormControl>
              <span className={styles.formMessage}>
                <FormMessage />
              </span>
            </FormItem>
          )}
        />

        {/* Gender Field */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className={styles.genderField}>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className={styles.radioGroup}
                >
                  <div className={styles.radioOption}>
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className={styles.radioOption}>
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className={styles.row}>
        {/* Height Fields */}
        <div className={styles.heightContainer}>
          <Label>Height</Label>
          <div className={styles.heightInputs}>
            <div className={styles.heightField}>
              <Input
                placeholder="Feet"
                value={feet}
                onChange={(e) => {
                  const newFeet = e.target.value;
                  setFeet(newFeet);
                  updateHeight(newFeet, inches);
                }}
              />
            </div>
            <div className={styles.heightField}>
              <Input
                placeholder="Inches"
                value={inches}
                onChange={(e) => {
                  const newInches = e.target.value;
                  setInches(newInches);
                  updateHeight(feet, newInches);
                }}
              />
            </div>
          </div>
          {heightError && (
            <span className={styles.errorMessage}>{heightError}</span>
          )}
        </div>

        {/* Weight Field with validation */}
        <FormField
          control={form.control}
          name="weight"
          rules={{
            min: { value: 40, message: "Weight cannot less than 40 lbs" },
            max: { value: 600, message: "Weight cannot exceed 600 lbs" },
          }}
          render={({ field }) => (
            <FormItem className={styles.weightField}>
              <FormLabel>Weight (lbs)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter weight in lbs"
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    if (parseFloat(val) > 600) {
                      form.setError("weight", {
                        message: "Weight cannot exceed 600 lbs",
                      });
                    } else if (parseFloat(val) < 40) {
                      form.setError("weight", {
                        message: "Weight cannot less than 40 lbs",
                      });
                    } else {
                      form.clearErrors("weight");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
