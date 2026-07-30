"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./DashboardHeader.module.scss";
import Logo from "@/components/icons/Logo";
import Exit from "@/components/icons/Exit";
import LogoutModal from "../LogoutModal/LogoutModal";

export default function DashboardHeader() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/verify-otp") {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.replace("/");
    router.refresh();
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Logo />
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
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
