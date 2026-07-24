"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRive } from "@rive-app/react-canvas";
import styles from "./page.module.scss";
import { Clock } from "lucide-react";

export default function OtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const { RiveComponent } = useRive({
    src: "/wou-logo-2.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");

    if (!savedEmail) {
      router.replace("/");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

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
    <div className={styles.page}>
      <Image
        src="/loginbg.png"
        alt=""
        fill
        priority
        className={styles.background}
      />

      <div className={styles.overlay} />

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <RiveComponent />
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
      </aside>

      <div className={styles.content}>
        <div className={styles.card}>
          <button
            className={styles.changeEmail}
            type="button"
            onClick={() => router.push("/")}
          >
            ← Change Email
          </button>

          <div className={styles.iconBox}><Clock size={50} /></div>

          <h2>Check your email</h2>

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
              Resend code in <strong>21s</strong>
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
        </div>
      </div>
    </div>
  );
}
