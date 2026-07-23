"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  Bookmark,
  Clock3,
  Eye,
  Gamepad2,
  Sprout,
  UsersRound,
} from "lucide-react";

import styles from "./page.module.scss";

import { AppDispatch, RootState } from "@/lib/store";
import { clearAuth, setLoading, setUser } from "@/lib/features/auth/authSlice";

import DashboardHeader from "./components/DashboardHeader";
import StatsCard from "./components/StatsCard";
import HighlightCard from "./components/HighlightCard";

interface DashboardData {
  instagram: {
    followersCount: number;
    mostViewedPost: {
      caption: string;
      image: string;
      permalink: string;
      views: number;
      totalSaves: number;
    } | null;
  };

  game: {
    seedPlanted: {
      count: number;
    };
    webPlaythroughs: number | null;
  };

  mostViewedArticle: unknown;
}

interface DashboardClientProps {
  dashboardData: DashboardData;
}

export default function DashboardClient({
  dashboardData,
}: DashboardClientProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadSession = async () => {
      dispatch(setLoading(true));

      try {
        const response = await fetch("/api/auth/session");

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
    return <main className={styles.loading}>Loading Dashboard...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardHeader onLogout={handleLogout} />

      <main className={styles.container}>
        <section className={styles.statsGrid}>
          <StatsCard
            title="Seeds Planted"
            value={dashboardData.game.seedPlanted.count}
            growth={8.4}
            growthType="positive"
            icon={<Sprout />}
          />

          <StatsCard
            title="Web Playthroughs"
            value={dashboardData.game.webPlaythroughs ?? 0}
            growth={5.6}
            growthType="positive"
            icon={<Gamepad2 />}
          />

          <StatsCard
            title="Follower Count"
            value={dashboardData.instagram.followersCount}
            growth={2.1}
            growthType="positive"
            icon={<UsersRound />}
          />
        </section>

        <section className={styles.highlightGrid}>
          {dashboardData.instagram.mostViewedPost && (
            <HighlightCard
              title="Most Viewed Post"
              image={dashboardData.instagram.mostViewedPost.image}
              avatar="/instagram.png"
              username="@worldofus"
              subText="2 days ago"
              heading="Secrets of the Grove."
              stats={[
                {
                  icon: <Eye size={18} />,
                  value: dashboardData.instagram.mostViewedPost.views,
                  label: "VIEWS",
                },
                {
                  icon: <Bookmark size={18} />,
                  value: dashboardData.instagram.mostViewedPost.totalSaves,
                  label: "SAVES",
                },
              ]}
            />
          )}

          <HighlightCard
            title="Most Read Article"
            image="..."
            heading="The Myth of the Stone Guardians"
            stats={[
              {
                icon: <Eye size={18} />,
                value: "876",
                label: "VIEWS",
              },
              {
                icon: <Clock3 size={18} />,
                value: "4 MINS",
                label: "AVG TIME SPENT",
              },
            ]}
          />
        </section>
      </main>
    </>
  );
}
