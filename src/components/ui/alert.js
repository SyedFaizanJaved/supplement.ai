import  React from "react"
import styles from './alert.module.css';

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variantClass = variant === 'default' ? styles.default : styles.destructive;
  
  return (
    <div
      ref={ref}
      role="alert"
      className={`${styles.alert} ${variantClass} ${className || ''}`}
      {...props}
    />
  );
});
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={`${styles.title} ${className || ''}`}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`${styles.description} ${className || ''}`}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }