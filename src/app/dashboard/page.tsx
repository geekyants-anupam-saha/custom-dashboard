"use client";

import { useEffect, useState } from "react";
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
  mostViewedArticle: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { user, status } = useSelector((state: RootState) => state.auth);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  const [dashboardLoading, setDashboardLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setDashboardLoading(true);

      const res = await fetch("/api/dashboard");

      const data = await res.json();

      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleLogout = async () => {
    dispatch(setLoading(true));

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    dispatch(clearAuth());

    router.replace("/");

    dispatch(setLoading(false));
  };

  if (status === "loading" || dashboardLoading) {
    return <main className={styles.loading}>Loading Dashboard...</main>;
  }

  if (!user || !dashboardData) return null;

  return (
    <>
      <DashboardHeader onLogout={handleLogout} />

      <main className={styles.container}>
        {/* Top Stats */}

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
            value={12490}
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

        {/* Bottom Cards */}

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
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhpsRqRbfNEh8Lu3LjvAFysdyCETF-qQnQGavfk9Ymdh1DGleOLkDbuc8&s=10"
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
