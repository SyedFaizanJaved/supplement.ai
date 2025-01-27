import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import styles from './label.module.css';

const Label = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={`${styles.label} ${className || ''}`}
      {...restProps}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };