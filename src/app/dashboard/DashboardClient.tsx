"use client";

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
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mostViewedArticle: any;
}

export default function DashboardPage({
  dashboardData,
  mostViewedArticle,
}: DashboardPageProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/");
    router.refresh();
  };
  const averageSessionDuration = mostViewedArticle?.averageSessionDuration ?? 0;

  return (
    <div>
      <DashboardHeader onLogout={handleLogout} />

      <div className={styles.container}>
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

        <div className={styles.highlightGrid}>
          {dashboardData.instagram.mostViewedPost && (
            <HighlightCard
              title="Most Viewed Post"
              image={dashboardData.instagram.mostViewedPost.image}
              avatar="/instagram.avif"
              username="@worldofus"
              subText={getTimeAgo(
                dashboardData.instagram.mostViewedPost.timestamp,
              )}
              description={dashboardData.instagram.mostViewedPost.caption}
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
                  value: averageSessionDuration >= 60
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
  );
}
