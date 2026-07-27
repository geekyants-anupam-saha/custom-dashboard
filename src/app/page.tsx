"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.scss";
import Logo from "@/components/icons/Logo";

export default function HomePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);


  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSendingOtp) return;

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send OTP.");
      }

      sessionStorage.setItem("email", trimmedEmail);

      router.push("/verify-otp");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className={styles.page}>
      <Image
        src="/loginbg.png"
        alt="Background"
        fill
        priority
        className={styles.background}
      />

      <div className={styles.overlay} />

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
      </div>

      {/* Login Card */}
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.iconBox}>→</div>

          <h2>Sign in</h2>

          <p className={styles.subtitle}>
            Enter your email and we'll send you a one-time code.
          </p>

          <form onSubmit={handleSendOtp} className={styles.form}>
            <label htmlFor="email">Your Email</label>

            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={isSendingOtp}
            />

            {error && <span className={styles.error}>{error}</span>}

            <p className={styles.terms}>
              By signing in you agree to our <a href="#">Terms of Service</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={isSendingOtp}>
              {isSendingOtp ? "Sending..." : "SUBMIT →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
