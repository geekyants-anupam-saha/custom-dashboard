"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import { AppDispatch, RootState } from "@/lib/store";
import { setError } from "@/lib/features/auth/authSlice";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSendingOtp) return;

    dispatch(setError(null));
    setIsSendingOtp(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send OTP");
      }

      sessionStorage.setItem("email", email.trim());

      router.push("/otp");
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : "Failed to send OTP"),
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={styles.input}
            disabled={isSendingOtp}
            required
          />

          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={isSendingOtp}
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {error && <p className={styles.errorText}>{error}</p>}
      </section>
    </main>
  );
}
