"use client";

import { CalendarDays, ChevronDown, LogOut } from "lucide-react";
import { useRive } from "@rive-app/react-canvas";
import styles from "./DashboardHeader.module.scss";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const { RiveComponent } = useRive({
    src: "/wou-logo-2.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div
          style={{
            width: 160,
            height: 60,
            cursor: "pointer",
          }}
        >
          <RiveComponent />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.dateButton}>
          <CalendarDays size={18} />

          <span>Last 12 Months</span>

          <span className={styles.date}>Jun 4 - Jul 1, 2026</span>

          <ChevronDown size={16} />
        </button>

        <div className={styles.divider} />

        <button className={styles.logout} onClick={onLogout}>
          Logout
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
