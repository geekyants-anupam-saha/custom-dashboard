import React from "react";
import Link from "next/link";
import Logo from "@/components/icons/Logo";
import styles from "./AuthLayout.module.scss";

const FOOTER_LINKS = [
  {
    label: "TERMS OF SERVICE",
    href: `${process.env.NEXT_PUBLIC_WORLD_OF_US_URL}/terms-and-conditions`,
  },
  {
    label: "PRIVACY POLICY",
    href: `${process.env.NEXT_PUBLIC_WORLD_OF_US_URL}/privacy-policy`,
  },
  {
    label: "IMPRINT",
    href: `${process.env.NEXT_PUBLIC_WORLD_OF_US_URL}/imprint`,
  },
];

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
          <h1>Stories, Myths & A Caring World.</h1>

          <p>
            Your personal analytics dashboard for tracking the stories that
            matter most.
          </p>
        </div>
        <div className={styles.footer}>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerText}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className={styles.content}>
        <div className={styles.card}>{children}</div>
      </div>
    </div>
  );
}
