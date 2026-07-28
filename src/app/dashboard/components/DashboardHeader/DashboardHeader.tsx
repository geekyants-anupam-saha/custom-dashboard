"use client";
import styles from "./DashboardHeader.module.scss";
import Logo from "@/components/icons/Logo";
import Exit from "@/components/icons/Exit";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div
          style={{
            width: 160,
            height: 60,
            cursor: "pointer",
          }}
        >
          <Logo />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.logout} onClick={onLogout}>
          Logout
          <Exit color="white" size={15} />
        </button>
      </div>
    </div>
  );
}
