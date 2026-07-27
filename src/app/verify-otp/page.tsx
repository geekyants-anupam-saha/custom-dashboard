"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import AuthLayout from "@/components/layout/AuthLayout";
import Clock from "@/components/icons/Clock";
import { ArrowLeft } from "lucide-react";

export default function OtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [timer, setTimer] = useState(21);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");

    if (!savedEmail) {
      router.replace("/");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResendOtp = async () => {
    if (isResending) return;
    setIsResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to resend OTP.");
      }

      setTimer(21);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
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
    <AuthLayout>
      <button
        className={styles.changeEmail}
        type="button"
        onClick={() => router.push("/")}
      >
        <ArrowLeft /> Change Email
      </button>

      <div className={styles.iconBox}>
        <Clock size={50} />
      </div>

      <p className={styles.signInHeading}>Check your email</p>

      <p className={styles.subtitle}>
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerifyOtp} className={styles.form}>
        <input
          type="text"
          value={otp}
          maxLength={6}
          inputMode="numeric"
          placeholder="X X X X X X"
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            if (error) setError("");
          }}
        />

        <div className={styles.resend}>
          {timer > 0 ? (
            <>
              Resend code in <strong>{timer}s</strong>
            </>
          ) : (
            <button
              type="button"
              className={styles.resendBtn}
              onClick={handleResendOtp}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {error && <span className={styles.error}>{error}</span>}

        <button className={styles.verifyBtn} disabled={isVerifyingOtp}>
          {isVerifyingOtp ? "VERIFYING..." : "VERIFY & SIGN IN"}
        </button>
      </form>

      <p className={styles.footerText}>
        Didn't get it? Check your spam folder or{" "}
        <button type="button" onClick={() => router.push("/")}>
          try another email.
        </button>
      </p>
    </AuthLayout>
  );
}
