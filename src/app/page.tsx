"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { clearAuth, setError, setLoading, setUser } from "@/lib/features/auth/authSlice";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramLoading, setInstagramLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [mediaCount, setMediaCount] = useState<number | null>(null);

  const fetchInstagramStats = async () => {
    try {
      const response = await fetch("/api/instagram/followers_count");
      if (!response.ok) {
        throw new Error("Unable to load Instagram stats");
      }

      const data = await response.json();
      setFollowersCount(data.followers_count ?? null);
      setMediaCount(data.media_count ?? null);
    } catch (err) {
      console.error(err);
      setFollowersCount(null);
      setMediaCount(null);
    }
  };

  const fetchInstagramStatus = async () => {
    try {
      const response = await fetch("/api/auth/facebook/status");
      const data = await response.json();
      const connected = Boolean(data.connected);
      setInstagramConnected(connected);

      if (connected) {
        await fetchInstagramStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInstagramLoading(false);
    }
  };

  const connectInstagram = () => {
    window.open(
      "/api/auth/facebook",
      "instagram-auth",
      "width=600,height=700"
    );
  };

  useEffect(() => {
    const fetchInstagramStatus = async () => {
    try {
      const response = await fetch("/api/auth/facebook/status");
      const data = await response.json();
      const connected = Boolean(data.connected);
      setInstagramConnected(connected);

      if (connected) {
        await fetchInstagramStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInstagramLoading(false);
    }
  };
  fetchInstagramStatus();
  }, [])

  useEffect(() => {
    const loadSession = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          dispatch(setUser(data.user));
        } else {
          dispatch(clearAuth());
        }
      } catch {
        dispatch(clearAuth());
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadSession();
    
  }, [dispatch]);

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type !== "INSTAGRAM_CONNECTED") {
        return;
      }

      setInstagramConnected(true);
      await fetchInstagramStats();
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep("otp");
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Failed to send OTP"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "Failed to verify OTP"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    dispatch(setLoading(true));
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearAuth());
    setStep("email");
    setOtp("");
    dispatch(setLoading(false));
  };

  if (status === "loading") {
    return <div className="page-shell"><p>Loading WoU Dashboard…</p></div>;
  }

  if (user) {
    return (
      <main className="page-shell">
        <section className="card large">
          <div className="card-header">
            <div>
              <p className="eyebrow">WoU Dashboard</p>
              <h1>Welcome back</h1>
            </div>
            <button className="button secondary" onClick={handleLogout}>Logout</button>
          </div>
          <p className="muted">Signed in as {user.email}</p>
          <div className="stats-grid">
            <article className="stat-card">
              <h2>Observers</h2>
              <p>24 active</p>
            </article>
            <article className="stat-card">
              <h2>Reports</h2>
              <p>12 pending review</p>
            </article>
            <article className="stat-card">
              <h2>Instagram</h2>
              {instagramLoading ? (
                <p className="muted">Checking connection…</p>
              ) : instagramConnected ? (
                <>
                  <p className="muted">Followers: {followersCount ?? "—"}</p>
                  <p className="muted">Posts: {mediaCount ?? "—"}</p>
                </>
              ) : (
                <>
                  <p className="muted">Not connected yet</p>
                  <button className="button primary" onClick={connectInstagram}>
                    Connect Instagram
                  </button>
                </>
              )}
            </article>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">WoU Dashboard</p>
        <h1>Secure access</h1>
        <p className="muted">Use your approved email address to receive an OTP and enter the dashboard.</p>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="form-stack">
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="input"
              required
            />
            <button className="button primary" type="submit">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="form-stack">
            <label className="field-label" htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter 6-digit code"
              className="input"
              required
            />
            <button className="button primary" type="submit">Verify</button>
          </form>
        )}

        {error ? <p className="error-text">{error}</p> : null}
      </section>
    </main>
  );
}
