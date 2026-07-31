/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { CalendarDays, ChevronDown, Bookmark } from "lucide-react";

import DateRangeModal from "./components/DateRangeModal/DateRangeModal";
import { getRangeByKey } from "./components/DateRangeModal/dateRanges";

import styles from "./page.module.scss";
import Plant from "@/components/icons/Plant";
import Game from "@/components/icons/Game";
import People from "@/components/icons/People";
import Clock from "@/components/icons/Clock";
import Eye from "@/components/icons/Eye";
import Rotate from "@/components/icons/Rotate";
import StatsCard from "./components/StatsCard/StatsCard";
import HighlightCard from "./components/HighlightCard/HighlightCard";
import DashboardSkeleton from "./components/DashboardSkeleton/DashboardSkeleton";
import Instagram from "@/components/icons/Instagram";

interface DashboardPageProps {
  dashboardData: {
    lastUpdated: string;
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
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const dashboardData = initialDashboardData;
  const mostViewedArticle = dashboardData.mostViewedArticle;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [dashboardData]);

  const selectedRange = useMemo(() => {
    const range = searchParams.get("range");
    return getRangeByKey(range ?? "lastMonth");
  }, [searchParams]);

  const customStart = searchParams.get("startDate");
  const customEnd = searchParams.get("endDate");

  const displayDate =
    customStart && customEnd
      ? `${new Date(customStart).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${new Date(customEnd).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : selectedRange.displayRange;

  const averageSessionDuration = mostViewedArticle?.averageSessionDuration ?? 0;
  const formattedLastUpdated = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dashboardData.lastUpdated));

  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.controlsRow}>
          <div className={styles.dateWrapper}>
            <button
              className={styles.dateButtonText}
              onClick={() => setOpen((prev) => !prev)}
            >
              <CalendarDays color="var(--text-muted)" size={16} />
              <span>{selectedRange.label}</span>
              <span className={styles.date} suppressHydrationWarning>
                {displayDate}
              </span>
              <ChevronDown
                color="var(--text-muted)"
                size={14}
                className={open ? styles.rotate : ""}
              />
            </button>
            <DateRangeModal
              open={open}
              onClose={() => setOpen(false)}
              onSelect={() => setLoading(true)}
            />
          </div>

          <div className={styles.lastUpdated}>
            <Rotate
              key={dashboardData.lastUpdated}
              color="var(--text-muted)"
              size={18}
              className={styles.spin}
            />
            <span>
              Last Updated:{" "}
              <span suppressHydrationWarning className={styles.lastUpdatedText}>
                {formattedLastUpdated}
              </span>
            </span>
          </div>
        </div>

        <div>
          <h1 className={styles.heading}>Overview</h1>
          <div className={styles.statsGrid}>
            <StatsCard
              title="Seeds Planted"
              value={dashboardData.game.seedPlanted.count}
              icon={<Plant />}
              tooltip="This is all time data"
            />

            <StatsCard
              title="Web Playthroughs"
              value={dashboardData.game.webPlaythroughs ?? 0}
              icon={<Game />}
            />

            <StatsCard
              title="Follower Count"
              value={dashboardData.instagram.followersCount}
              icon={<People />}
              tooltip="This is all time data"
            />
          </div>
        </div>
        <div>
          {(dashboardData.instagram.mostViewedPost ||
            mostViewedArticle ||
            true) && (
            <h1 className={styles.heading}>What moved the audience</h1>
          )}
          <div className={styles.highlightGrid}>
            <HighlightCard
              title="Most Viewed Post"
              isEmpty={!dashboardData.instagram.mostViewedPost}
              emptyMessage="We couldn't find any data for the selected date range. Please try adjusting the dates or check back later!"
              image={dashboardData.instagram.mostViewedPost?.image}
              avatar={<Instagram />}
              username="@worldofus"
              buttonText="See Post"
              postLink={dashboardData.instagram.mostViewedPost?.permalink}
              stats={
                dashboardData.instagram.mostViewedPost
                  ? [
                      {
                        icon: <Eye size={18} />,
                        value: dashboardData.instagram.mostViewedPost.views,
                        label: "VIEWS",
                      },
                      {
                        icon: <Bookmark size={18} color="#E3F24F" />,
                        value:
                          dashboardData.instagram.mostViewedPost.totalSaves,
                        label: "SAVES",
                      },
                    ]
                  : []
              }
            />

            <HighlightCard
              title="Most Read Article"
              isEmpty={!mostViewedArticle}
              emptyMessage="We couldn't find any article for the selected date range. Please try adjusting the dates or check back later!"
              image={
                mostViewedArticle?.attributes?.CoverImg?.data?.attributes?.url
              }
              heading={mostViewedArticle?.attributes?.Title}
              buttonText="See Article"
              postLink={
                mostViewedArticle
                  ? `${process.env.NEXT_PUBLIC_WORLD_OF_US_URL}${mostViewedArticle.pagePath}`
                  : undefined
              }
              stats={
                mostViewedArticle
                  ? [
                      {
                        icon: <Eye />,
                        value: mostViewedArticle.pageViews,
                        label: "VIEWS",
                      },
                      {
                        icon: <Clock color="#E3F24F" />,
                        value:
                          averageSessionDuration >= 60
                            ? `${Math.floor(averageSessionDuration / 60)} MINS`
                            : `${Math.round(averageSessionDuration)} SEC`,
                        label: "AVG TIME",
                      },
                    ]
                  : []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
