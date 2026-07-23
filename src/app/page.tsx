"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function HomePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
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
    <main className={styles.pageShell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>WoU Dashboard</p>

        <h1>Secure access</h1>

        <p className={styles.muted}>
          Use your approved email address to receive an OTP and enter the
          dashboard.
        </p>

        <form onSubmit={handleSendOtp} className={styles.formStack}>
          <label className={styles.fieldLabel} htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="you@example.com"
            className={styles.input}
            disabled={isSendingOtp}
            required
          />

          {error && <p className={styles.errorText}>{error}</p>}

          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={isSendingOtp}
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </section>
    </main>
  );
}