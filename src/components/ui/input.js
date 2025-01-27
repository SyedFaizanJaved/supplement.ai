import React from 'react';
import styles from './input.module.css';

const Input = React.forwardRef((props, ref) => {
  const { className, type, ...restProps } = props;
  
  return (
    <input
      type={type}
      className={`${styles.input} ${className || ''}`}
      ref={ref}
      {...restProps}
    />
  );
});

Input.displayName = "Input";

export { Input };