import { ReactNode } from "react";
import { Info } from "lucide-react";
import styles from "./StatsCard.module.scss";
import Tooltip from "@/components/Tooltip";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  tooltip?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  tooltip,
}: StatsCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.iconWrapper}>{icon}</div>
      </div>

      <div className={styles.content}>
        <h2>{value == null || value === "N/A" ? "N/A" : typeof value === 'number' ? value.toLocaleString() : value}</h2>
        <div className={styles.titleWrapper}>
          <h3>{title}</h3>
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info size={16} className={styles.infoIcon} />
            </Tooltip>
          )}
        </div>
      </div>
    </article>
  );
}
