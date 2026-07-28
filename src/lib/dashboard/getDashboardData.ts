import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { GoogleAuth } from "google-auth-library";
import { getArticleData } from "@/services";
import { fetchData } from "@/services/fetchData";

const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN!;
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID!;
const METRICS_TOKEN = process.env.METRICS_API_TOKEN!;

const revalidateTime = 60 * 60 * 24;

interface DashboardDateRange {
  startDate: string;
  endDate: string;
}

function getMetricsApiUrl() {
  const params = new URLSearchParams({
    groupBy: "metricKey",
    operation: "sum",
    limit: "500",
    metricGroups: "planting",
  });

  return `https://admin.game.worldofus.info/api/metrics/query?${params.toString()}`;
}

function isWithinDateRange(
  date: string,
  { startDate, endDate }: DashboardDateRange,
) {
  const value = new Date(date).getTime();

  return (
    value >= new Date(startDate).getTime() &&
    value <= new Date(endDate).getTime()
  );
}

const getInstagramDataCached = unstable_cache(
  async (range: DashboardDateRange) => {
    try {
      const accountRes = await fetch(
        `https://graph.facebook.com/v23.0/${INSTAGRAM_ACCOUNT_ID}?fields=followers_count&access_token=${FB_PAGE_ACCESS_TOKEN}`,
      );

      if (!accountRes.ok) {
        throw new Error(`Instagram account API failed: ${accountRes.status}`);
      }

      const account = await accountRes.json();

      const allPosts: any[] = [];
      let nextUrl: string | null =
        `https://graph.facebook.com/v23.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,media_url,thumbnail_url,media_type,permalink,timestamp,like_count,comments_count,insights.metric(views,saved)&limit=100&access_token=${FB_PAGE_ACCESS_TOKEN}`;

      const rangeStartTime = new Date(range.startDate).getTime();

      while (nextUrl) {
        try {
          const res: any = await fetch(nextUrl);
          if (!res.ok) {
            console.error(`Instagram media API failed: ${res.status}`);
            break;
          }
          const data = await res.json();
          const fetchedPosts = data.data ?? [];
          allPosts.push(...fetchedPosts);

          if (fetchedPosts.length > 0) {
            const oldestPostInBatch = fetchedPosts[fetchedPosts.length - 1];
            if (
              new Date(oldestPostInBatch.timestamp).getTime() < rangeStartTime
            ) {
              break;
            }
          }

          nextUrl = data.paging?.next ?? null;
        } catch (pageErr) {
          console.error("Instagram pagination error:", pageErr);
          break;
        }
      }

      const filteredPosts = allPosts.filter((post) =>
        isWithinDateRange(post.timestamp, range),
      );

      const posts = filteredPosts.map((item: any) => ({
        id: item.id,
        caption: item.caption,
        mediaUrl: item.media_url,
        thumbnailUrl: item.thumbnail_url,
        image:
          item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
        mediaType: item.media_type,
        permalink: item.permalink,
        timestamp: item.timestamp,
        likes: item.like_count ?? 0,
        comments: item.comments_count ?? 0,
        views:
          item.insights?.data?.find((metric: any) => metric.name === "views")
            ?.values?.[0]?.value ?? 0,
        totalSaves:
          item.insights?.data?.find((metric: any) => metric.name === "saved")
            ?.values?.[0]?.value ?? 0,
      }));

      const mostViewedPost =
        posts.length > 0
          ? posts.reduce((max, post) => (post.views > max.views ? post : max))
          : null;

      return {
        followersCount: account.followers_count ?? 0,
        mostViewedPost,
      };
    } catch (err) {
      throw new Error(
        `Failed to fetch Instagram data: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  },
  ["instagram-data-optimized"],
  { revalidate: revalidateTime },
);

async function getInstagramData(range: DashboardDateRange) {
  return unstable_cache(
    () => getInstagramDataCached(range),
    ["instagram-data-optimized", range.startDate, range.endDate],
    { revalidate: revalidateTime },
  )();
}

async function getSeedPlanted() {
  try {
    const res = await fetch(getMetricsApiUrl(), {
      headers: {
        "X-Metrics-Api-Token": METRICS_TOKEN,
      },
      next: {
        revalidate: revalidateTime,
      },
    });

    if (!res.ok) {
      throw new Error(`Metrics API failed: ${res.status}`);
    }

    const data = await res.json();

    const planted = data.aggregates.find(
      (item: any) => item.key === "planting.seedPlanted.count",
    );

    return {
      count: planted?.value ?? 0,
      users: planted?.distinctUsers ?? 0,
      sessions: planted?.distinctSessions ?? 0,
    };
  } catch (err) {
    throw new Error(
      `Failed to fetch planting metrics: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

async function getAnalyticsPageVisits(range: DashboardDateRange) {
  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    const formatDate = (date: string) => {
      return date.includes("T") ? date.split("T")[0] : date;
    };

    const startDate = formatDate(range.startDate);
    const endDate = formatDate(range.endDate);

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [
            {
              startDate: startDate,
              endDate: endDate,
            },
          ],
          dimensions: [{ name: "pagePath" }],
          metrics: [
            { name: "screenPageViews" },
            { name: "userEngagementDuration" },
            { name: "activeUsers" },
          ],
          orderBys: [
            {
              metric: {
                metricName: "screenPageViews",
              },
              desc: true,
            },
          ],
          limit: 100,
        }),
        next: {
          revalidate: revalidateTime,
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return [];
    }

    return (
      data.rows?.map((row: any) => {
        const pageViews = Number(row.metricValues?.[0]?.value ?? 0);

        const userEngagementDuration = Number(
          row.metricValues?.[1]?.value ?? 0,
        );

        const activeUsers = Number(row.metricValues?.[2]?.value ?? 0);

        return {
          pagePath: row.dimensionValues?.[0]?.value ?? "",
          pageTitle: row.dimensionValues?.[1]?.value ?? "",
          pageViews,
          averageEngagementPerActiveUser:
            activeUsers > 0 ? userEngagementDuration / activeUsers : 0,
        };
      }) ?? []
    );
  } catch (err) {
    throw new Error(
      `Failed to fetch Google Analytics data: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
const getAllArticlesCached = unstable_cache(
  async () => {
    try {
      return await fetchData(getArticleData, {
        locale: "en",
        page: 1,
        pageSize: 1000,
      });
    } catch (err) {
      throw new Error(
        `Failed to fetch articles data: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  },
  ["all-articles-v2"],
  { revalidate: revalidateTime },
);

async function fetchDashboardData(range: DashboardDateRange) {
  try {
    const [instagram, seedPlanted, analyticsPageVisits, articlesData] =
      await Promise.all([
        getInstagramData(range),
        getSeedPlanted(),
        getAnalyticsPageVisits(range),
        getAllArticlesCached(),
      ]);

    const gamePage = analyticsPageVisits.find(
      (page: any) => page.pagePath === "/game",
    );
    const webPlaythroughs = gamePage ? gamePage.pageViews : 0;

    const articles = (articlesData as any)?.articles?.data ?? [];
    let mostViewedArticle = null;

    for (const page of analyticsPageVisits) {
      const pageSlug = page.pagePath?.split("/").filter(Boolean).pop();

      const articleData = articles.find((article: any) => {
        const slug = article.attributes?.Slug;
        return pageSlug?.toLowerCase() === slug?.toLowerCase();
      });

      if (articleData) {
        mostViewedArticle = {
          ...articleData,
          pageViews: page.pageViews,
          averageSessionDuration: page.averageEngagementPerActiveUser,
          pagePath: page.pagePath,
          pageTitle: page.pageTitle,
          slug: articleData.attributes?.Slug,
        };
        break;
      }
    }

    return {
      instagram,
      game: {
        seedPlanted,
        webPlaythroughs,
      },
      mostViewedArticle,
    };
  } catch (err) {
    throw new Error(
      `Dashboard data fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export async function getDashboardData(startDate?: string, endDate?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const actualStartDate =
    startDate ??
    new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    ).toISOString();
  const actualEndDate = endDate ?? new Date().toISOString();

  const cacheKeyStart = actualStartDate.split("T")[0];
  const cacheKeyEnd = actualEndDate.split("T")[0];

  const queryStartDate = `${cacheKeyStart}T00:00:00.000Z`;
  const queryEndDate = `${cacheKeyEnd}T23:59:59.999Z`;

  return fetchDashboardData({
    startDate: queryStartDate,
    endDate: queryEndDate,
  });
}
