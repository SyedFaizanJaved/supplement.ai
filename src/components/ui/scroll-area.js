import React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import styles from './scroll-area.module.css';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className={styles.viewport}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => {
  const getOrientationClass = (orientation) => {
    return orientation === "vertical" ? styles.scrollbarVertical : styles.scrollbarHorizontal;
  };

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={`${styles.scrollbar} ${getOrientationClass(orientation)} ${className || ''}`}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={styles.thumb} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };