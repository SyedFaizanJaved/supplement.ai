import React, { forwardRef ,useState} from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import styles from './toast.module.css';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={`${styles.viewport} ${className || ''}`}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = forwardRef(({ className, variant = 'default', onOpenChange, ...props }, ref) => {
  const [isClosing, setIsClosing] = useState(false);
  const variantClass = variant === 'destructive' ? styles.destructive : styles.default;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange?.(false);
    }, 200); 
  };

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={`${styles.toast} ${variantClass} ${className || ''} ${isClosing ? styles.closing : ''}`}
      onOpenChange={handleClose}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={`${styles.action} ${className || ''}`}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={`${styles.close} ${className || ''}`}
    aria-label="Close"
    {...props}
  >
    <X className={styles.closeIcon} />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={`${styles.title} ${className || ''}`}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={`${styles.description} ${className || ''}`}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};