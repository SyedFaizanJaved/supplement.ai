import React from 'react';
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import styles from './PersonalInfoInputs.module.css';

export const PersonalInfoInputs = ({ form }) => {
  const handlePhoneInput = (e) => {
    let cleaned = e.target.value.replace(/\D/g, '');
    cleaned = cleaned.slice(0, 10);
    
    if (cleaned.length >= 6) {
      cleaned = `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length >= 3) {
      cleaned = `(${cleaned.slice(0,3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
      cleaned = `(${cleaned}`;
    }
    
    form.setValue('phone', cleaned);
  };

  return (
    <div className={styles.container}>
      <div className={styles.nameFields}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className={styles.nameFields}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="(123) 456-7890"
                maxLength={14}
                onChange={handlePhoneInput}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      </div>

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};