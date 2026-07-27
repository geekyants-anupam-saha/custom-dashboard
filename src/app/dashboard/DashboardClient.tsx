"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Clock3,
  Eye,
  Gamepad2,
  Sprout,
  UsersRound,
} from "lucide-react";

import styles from "./page.module.scss";

import DashboardHeader from "./components/DashboardHeader";
import StatsCard from "./components/StatsCard";
import HighlightCard from "./components/HighlightCard";
import { getTimeAgo } from "../../../utils";
import DashboardSkeleton from "./components/DashboardSkeleton";

interface DashboardPageProps {
  dashboardData: {
    instagram: {
      followersCount: number;
      mostViewedPost: {
        caption: string;
        image: string;
        permalink: string;
        views: number;
        totalSaves: number;
        timestamp: string;
      } | null;
    };
    game: {
      seedPlanted: {
        count: number;
      };
      webPlaythroughs: number | null;
    };
    mostViewedArticle: any;
  };
}

export default function DashboardPage({
  dashboardData: initialDashboardData,
}: DashboardPageProps) {
  const router = useRouter();
  const dashboardData = initialDashboardData;
  const mostViewedArticle = dashboardData.mostViewedArticle;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [dashboardData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/");
    router.refresh();
  };
  const averageSessionDuration = mostViewedArticle?.averageSessionDuration ?? 0;

  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <div>
      <DashboardHeader
        onLogout={handleLogout}
        onDateSelect={() => setLoading(true)}
      />
      <div className={styles.container}>
        <div>
          <h1 className={styles.heading}>Overview</h1>
          <div className={styles.statsGrid}>
            <StatsCard
              title="Seeds Planted"
              value={dashboardData.game.seedPlanted.count}
              icon={<Sprout />}
            />

            <StatsCard
              title="Web Playthroughs"
              value={dashboardData.game.webPlaythroughs ?? 0}
              icon={<Gamepad2 />}
            />

            <StatsCard
              title="Follower Count"
              value={dashboardData.instagram.followersCount}
              icon={<UsersRound />}
            />
          </div>
        </div>
        <div>
          {(dashboardData.instagram.mostViewedPost || mostViewedArticle) && (
            <h1 className={styles.heading}>What moved the audience</h1>
          )}
          <div className={styles.highlightGrid}>
            {dashboardData.instagram.mostViewedPost && (
              <HighlightCard
                title="Most Viewed Post"
                image={dashboardData.instagram.mostViewedPost.image}
                avatar="/instagram.avif"
                username="@worldofus"
                buttonText="View Post"
                subText={getTimeAgo(
                  dashboardData.instagram.mostViewedPost.timestamp,
                )}
                postLink={dashboardData.instagram.mostViewedPost.permalink}
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

            {mostViewedArticle && (
              <HighlightCard
                title="Most Read Article"
                image={
                  mostViewedArticle.attributes.CoverImg?.data?.attributes?.url
                }
                heading={mostViewedArticle.attributes.Title}
                buttonText="Read Article"
                description={
                  mostViewedArticle.attributes.ShortDes?.replace(
                    /<[^>]*>/g,
                    "",
                  ) ?? ""
                }
                postLink={`${process.env.NEXT_PUBLIC_URL}${mostViewedArticle.pagePath}`}
                stats={[
                  {
                    icon: <Eye size={18} />,
                    value: mostViewedArticle.pageViews,
                    label: "VIEWS",
                  },
                  {
                    icon: <Clock3 size={18} />,
                    value:
                      averageSessionDuration >= 60
                        ? `${Math.floor(averageSessionDuration / 60)} MINS`
                        : `${Math.round(averageSessionDuration)} SEC`,
                    label: "AVG TIME",
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
