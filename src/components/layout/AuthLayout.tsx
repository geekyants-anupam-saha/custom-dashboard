import React from "react";
import Logo from "@/components/icons/Logo";
import styles from "./AuthLayout.module.scss";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Logo />
        </div>

        <div className={styles.sidebarContent}>
          <h1>
            Stories, Myths &
            <br />A Caring World.
          </h1>

          <p>
            Your personal analytics dashboard for tracking the stories that
            matter most.
          </p>
        </div>
        <div className={styles.footer}>
          <p className={styles.footerText}>TERMS OF SERVICE</p>
          <p className={styles.footerText}>PRIVACY POLICY</p>
          <p className={styles.footerText}>IMPRINT</p>
        </div>
      </div>

      {/* Right Content */}
      <div className={styles.content}>
        <div className={styles.card}>{children}</div>
      </div>
    </div>
  );
}
