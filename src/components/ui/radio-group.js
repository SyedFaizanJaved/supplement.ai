import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import styles from './radio-group.module.css';

const RadioGroup = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <RadioGroupPrimitive.Root
      className={`${styles.radioGroup} ${className || ''}`}
      {...restProps}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={`${styles.radioGroupItem} ${className || ''}`}
      {...restProps}
    >
      <RadioGroupPrimitive.Indicator className={styles.radioGroupIndicator}>
        <Circle className={styles.circle} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };