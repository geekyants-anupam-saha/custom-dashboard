import { ReactNode } from "react";
import styles from "./StatsCard.module.scss";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  growth?: number;
  growthType?: "positive" | "negative";
}

export default function StatsCard({
  title,
  value,
  icon,
  growth,
  growthType = "positive",
}: StatsCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.iconWrapper}>{icon}</div>

        {growth !== undefined && (
          <div
            className={`${styles.badge} ${
              growthType === "positive"
                ? styles.positive
                : styles.negative
            }`}
          >
            {growthType === "positive" ? "↗" : "↘"} {growth}%
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>

        <h2>{Number(value).toLocaleString()}</h2>
      </div>
    </article>
  );
}