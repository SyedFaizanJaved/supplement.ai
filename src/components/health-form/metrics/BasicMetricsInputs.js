import React, { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../ui/form";
import { useWatch } from "react-hook-form";
import styles from "./BasicMetricsInputs.module.css";

export const BasicMetricsInputs = ({ form }) => {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");


  const heightValue = useWatch({
    control: form.control,
    name: "height",
    defaultValue: "", 
  });

  useEffect(() => {
    if (heightValue) {
      const totalInches = Math.round(Number(heightValue) / 2.54);
      const calculatedFeet = Math.floor(totalInches / 12);
      const calculatedInches = totalInches % 12;
      setFeet(calculatedFeet.toString());
      setInches(calculatedInches.toString());
    }
  }, [heightValue]);

  const updateHeight = (newFeet, newInches) => {
    const totalInches = (parseInt(newFeet, 10) || 0) * 12 + (parseInt(newInches, 10) || 0);
    const cm = Math.round(totalInches * 2.54);
    form.setValue("height", cm.toString());
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem className={styles.ageField}>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter age" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className={styles.heightContainer}>
          <Label>Height</Label>
          <div className={styles.heightInputs}>
            <div className={styles.heightField}>
              <Input
                placeholder="Feet"
                value={feet}
                onChange={(e) => {
                  setFeet(e.target.value);
                  updateHeight(e.target.value, inches);
                }}
              />
            </div>
            <div className={styles.heightField}>
              <Input
                placeholder="Inches"
                value={inches}
                onChange={(e) => {
                  setInches(e.target.value);
                  updateHeight(feet, e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className={styles.weightField}>
              <FormLabel>Weight (lbs)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter weight in lbs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
  };