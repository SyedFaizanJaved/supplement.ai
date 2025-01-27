import React from "react";
import "./textarea.module.css";

const Textarea = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <textarea
      ref={ref}
      className={`textarea ${className}`} // Apply the custom className
      {...restProps}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
