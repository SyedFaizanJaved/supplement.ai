import React from 'react';
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import styles from './ActivityLevelSelect.module.css';

export const ActivityLevelSelect = ({ value, onValueChange }) => {
  return (
    <div className={styles.container}>
      <Label htmlFor="activityLevel">Activity Level</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className={styles.trigger}>
          <SelectValue placeholder="Select your activity level" />
        </SelectTrigger>
        <SelectContent className={styles.content}>
          <SelectItem value="sedentary">
            <div className={styles.optionContainer}>
              <div className={styles.optionTitle}>Sedentary</div>
              <div className={styles.optionDescription}>Little to no regular exercise</div>
            </div>
          </SelectItem>
          <SelectItem value="moderate">
            <div className={styles.optionContainer}>
              <div className={styles.optionTitle}>Moderately Active</div>
              <div className={styles.optionDescription}>Light exercise 2-3 times per week</div>
            </div>
          </SelectItem>
          <SelectItem value="active">
            <div className={styles.optionContainer}>
              <div className={styles.optionTitle}>Active</div>
              <div className={styles.optionDescription}>Moderate exercise 4-5 times per week</div>
            </div>
          </SelectItem>
          <SelectItem value="very_active">
            <div className={styles.optionContainer}>
              <div className={styles.optionTitle}>Very Active</div>
              <div className={styles.optionDescription}>Intense exercise 6+ times per week</div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};