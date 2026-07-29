"use client";
import { useState } from "react";
import styles from "./DashboardHeader.module.scss";
import Logo from "@/components/icons/Logo";
import Exit from "@/components/icons/Exit";
import LogoutModal from "../LogoutModal/LogoutModal";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
        <button
          className={styles.logout}
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
          <Exit color="white" size={15} />
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}
