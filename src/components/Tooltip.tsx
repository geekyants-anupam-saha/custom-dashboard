import React, { ReactNode } from "react";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export default function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className={styles.tooltipContainer}>
      {children}
      <div className={styles.tooltipText}>{content}</div>
    </div>
  );
}
