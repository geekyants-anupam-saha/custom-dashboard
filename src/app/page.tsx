"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import AuthLayout from "@/components/layout/AuthLayout";
import Login from "@/components/icons/Login";
import ArrowRight from "@/components/icons/ArrowRight";

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
    <AuthLayout>
      <div className={styles.iconBox}>
        <Login />
      </div>

      <p className={styles.signInHeading}>Sign in</p>

      <p className={styles.subtitle}>
        Enter your email and we'll send you a one-time code.
      </p>

      <form onSubmit={handleSendOtp} className={styles.form}>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          disabled={isSendingOtp}
        />

        {error && <span className={styles.error}>{error}</span>}

        <p className={styles.terms}>
          By signing in you agree to our{" "}
          <a href="#" className={styles.anchor}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className={styles.anchor}>
            Privacy Policy
          </a>
          .
        </p>

        <button type="submit" disabled={isSendingOtp}>
          <span className={styles.buttonText}>
            {isSendingOtp ? "Sending..." : "SUBMIT"} <ArrowRight />
          </span>
        </button>
      </form>
    </AuthLayout>
  );
}
