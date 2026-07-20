"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styles from "./page.module.scss";

import { AppDispatch, RootState } from "@/lib/store";
import {
  clearAuth,
  setLoading,
  setUser,
} from "@/lib/features/auth/authSlice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, status } = useSelector(
    (state: RootState) => state.auth
  );

  const [instagramConnected, setInstagramConnected] =
    useState(false);

  const [instagramLoading, setInstagramLoading] =
    useState(true);

  const [followersCount, setFollowersCount] =
    useState<number | null>(null);

  const [mediaCount, setMediaCount] =
    useState<number | null>(null);

  const fetchInstagramStats = async () => {
    try {
      const response = await fetch(
        "/api/instagram/followers_count"
      );

      if (!response.ok) {
        throw new Error("Unable to load Instagram stats");
      }

      const data = await response.json();

      setFollowersCount(
        data.followers_count ?? null
      );

      setMediaCount(
        data.media_count ?? null
      );
    } catch (err) {
      console.error(err);

      setFollowersCount(null);
      setMediaCount(null);
    }
  };

  const fetchInstagramStatus = async () => {
    try {
      const response = await fetch(
        "/api/auth/facebook/status"
      );

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
    const loadSession = async () => {
      dispatch(setLoading(true));

      try {
        const response = await fetch(
          "/api/auth/session"
        );

        if (!response.ok) {
          dispatch(clearAuth());
          router.replace("/");
          return;
        }

        const data = await response.json();

        dispatch(setUser(data.user));
      } catch {
        dispatch(clearAuth());
        router.replace("/");
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadSession();
  }, [dispatch, router]);

  useEffect(() => {
    fetchInstagramStatus();
  }, []);

  useEffect(() => {
    const handler = async (
      event: MessageEvent
    ) => {
      if (
        event.data?.type !==
        "INSTAGRAM_CONNECTED"
      ) {
        return;
      }

      setInstagramConnected(true);

      await fetchInstagramStats();
    };

    window.addEventListener(
      "message",
      handler
    );

    return () => {
      window.removeEventListener(
        "message",
        handler
      );
    };
  }, []);

  const handleLogout = async () => {
    dispatch(setLoading(true));

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    dispatch(clearAuth());

    router.replace("/");

    dispatch(setLoading(false));
  };

  if (status === "loading") {
    return (
      <div className={styles.pageShell}>
        <p>Loading WoU Dashboard…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className={styles.pageShell}>
      <section
        className={`${styles.card} ${styles.large}`}
      >
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.eyebrow}>
              WoU Dashboard
            </p>

            <h1>Welcome back</h1>
          </div>

          <button
            className={`${styles.button} ${styles.secondary}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <p className={styles.muted}>
          Signed in as {user.email}
        </p>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <h2>Observers</h2>
            <p>24 active</p>
          </article>

          <article className={styles.statCard}>
            <h2>Reports</h2>
            <p>12 pending review</p>
          </article>

          <article className={styles.statCard}>
            <h2>Instagram</h2>

            {instagramLoading ? (
              <p className={styles.muted}>
                Checking connection…
              </p>
            ) : instagramConnected ? (
              <>
                <p className={styles.muted}>
                  Followers:{" "}
                  {followersCount ?? "—"}
                </p>

                <p className={styles.muted}>
                  Posts: {mediaCount ?? "—"}
                </p>
              </>
            ) : (
              <>
                <p className={styles.muted}>
                  Not connected yet
                </p>

                <button
                  className={`${styles.button} ${styles.primary}`}
                  onClick={connectInstagram}
                >
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