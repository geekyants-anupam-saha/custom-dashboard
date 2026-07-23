"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function OtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");

    if (!savedEmail) {
      router.replace("/");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isVerifyingOtp) return;

    setError("");

    if (otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to verify OTP.");
      }

      sessionStorage.removeItem("email");

      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <main className={styles.pageShell}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>WoU Dashboard</p>

        <h1>Secure access</h1>

        <p className={styles.muted}>
          Enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleVerifyOtp} className={styles.formStack}>
          <label htmlFor="otp" className={styles.fieldLabel}>
            OTP
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              if (error) setError("");
            }}
            className={styles.input}
            disabled={isVerifyingOtp}
            required
          />

          {error && <p className={styles.errorText}>{error}</p>}

          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={isVerifyingOtp}
          >
            {isVerifyingOtp ? "Verifying..." : "Verify"}
          </button>
        </form>
      </section>
    </main>
  );
}