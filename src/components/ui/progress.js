import React, { forwardRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import styles from './progress.module.css';

const Progress = forwardRef(({ className = '', value, ...props }, ref) => {
  const combinedClassName = `${styles.progressRoot} ${className}`.trim();
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={styles.progressIndicator}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };