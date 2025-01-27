import React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx"; // Install using `npm install clsx`
import styles from "./button.module.css";

const buttonVariants = ({ variant, size }) => {
  const baseClasses = styles.button;
  const variantClasses = styles[variant] || styles.default;
  const sizeClasses = styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`] || styles.sizeDefault;

  if (!styles[variant]) {
    console.warn(`Warning: Variant "${variant}" is not defined in your CSS module.`);
  }

  if (!styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`]) {
    console.warn(`Warning: Size "${size}" is not defined in your CSS module.`);
  }

  return clsx(baseClasses, variantClasses, sizeClasses);
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={clsx(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
