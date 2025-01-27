import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './select.module.css';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef((props, ref) => {
  const { className, children, ...restProps } = props;
  
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={`${styles.trigger} ${className || ''}`}
      {...restProps}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className={styles.icon} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

const SelectScrollUpButton = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={`${styles.scrollButton} ${className || ''}`}
      {...restProps}
    >
      <ChevronUp className={styles.icon} />
    </SelectPrimitive.ScrollUpButton>
  );
});

const SelectScrollDownButton = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={`${styles.scrollButton} ${className || ''}`}
      {...restProps}
    >
      <ChevronDown className={styles.icon} />
    </SelectPrimitive.ScrollDownButton>
  );
});

const SelectContent = React.forwardRef((props, ref) => {
  const { className, children, position = "popper", ...restProps } = props;
  
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={`${styles.content} ${position === "popper" ? styles.popperContent : ''} ${className || ''}`}
        position={position}
        {...restProps}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={`${styles.viewport} ${position === "popper" ? styles.popperViewport : ''}`}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

const SelectLabel = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={`${styles.label} ${className || ''}`}
      {...restProps}
    />
  );
});

const SelectItem = React.forwardRef((props, ref) => {
  const { className, children, ...restProps } = props;
  
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={`${styles.item} ${className || ''}`}
      {...restProps}
    >
      <span className={styles.itemIndicatorWrapper}>
        <SelectPrimitive.ItemIndicator>
          <Check className={styles.itemIndicator} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

const SelectSeparator = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={`${styles.separator} ${className || ''}`}
      {...restProps}
    />
  );
});

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
SelectContent.displayName = SelectPrimitive.Content.displayName;
SelectLabel.displayName = SelectPrimitive.Label.displayName;
SelectItem.displayName = SelectPrimitive.Item.displayName;
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};