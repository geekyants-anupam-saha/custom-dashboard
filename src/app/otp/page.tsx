"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import { AppDispatch, RootState } from "@/lib/store";
import {
  setError,
  setUser,
} from "@/lib/features/auth/authSlice";

export default function OtpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { error } = useSelector(
    (state: RootState) => state.auth
  );

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
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
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isVerifyingOtp) return;

    dispatch(setError(null));
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
        throw new Error(
          data.error ?? "Failed to verify OTP"
        );
      }

      dispatch(setUser(data.user));

      sessionStorage.removeItem("email");

      router.replace("/dashboard");
    } catch (err) {
      dispatch(
        setError(
          err instanceof Error
            ? err.message
            : "Failed to verify OTP"
        )
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

        <form
          onSubmit={handleVerifyOtp}
          className={styles.formStack}
        >
          <label
            htmlFor="otp"
            className={styles.fieldLabel}
          >
            OTP
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.input}
            disabled={isVerifyingOtp}
            required
          />

          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={isVerifyingOtp}
          >
            {isVerifyingOtp
              ? "Verifying..."
              : "Verify"}
          </button>
        </form>

        {error && (
          <p className={styles.errorText}>
            {error}
          </p>
        )}
      </section>
    </main>
  );
}