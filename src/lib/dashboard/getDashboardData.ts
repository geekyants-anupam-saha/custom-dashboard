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

const getAllInstagramPostsCached = unstable_cache(
  async () => {
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

      while (nextUrl) {
        try {
          const res: any = await fetch(nextUrl);
          if (!res.ok) {
            console.error(`Instagram media API failed: ${res.status}`);
            break;
          }
          const data = await res.json();
          allPosts.push(...(data.data ?? []));
          nextUrl = data.paging?.next ?? null;
        } catch (pageErr) {
          console.error("Instagram pagination error:", pageErr);
          break;
        }
      }

      return { account, allPosts };
    } catch (err) {
      console.error("Instagram fetch error:", err);
      return { account: { followers_count: 0 }, allPosts: [] };
    }
  },
  ["instagram-all-posts"],
  { revalidate: revalidateTime },
);

async function getInstagramData(range: DashboardDateRange) {
  try {
    const { account, allPosts } = await getAllInstagramPostsCached();

    const filteredPosts = allPosts.filter((post) =>
      isWithinDateRange(post.timestamp, range),
    );

    const posts = filteredPosts.map((item: any) => ({
      id: item.id,
      caption: item.caption,
      mediaUrl: item.media_url,
      thumbnailUrl: item.thumbnail_url,
      image: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
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
    console.error("Instagram error:", err);

    return {
      followersCount: 0,
      mostViewedPost: null,
    };
  }
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
    console.error("Metrics error:", err);

    return {
      count: 0,
      users: 0,
      sessions: 0,
    };
  }
}

async function getWebPlaythroughs() {
  try {
    const res = await fetch(getMetricsApiUrl(), {
      headers: {
        "X-Metrics-Api-Token": METRICS_TOKEN,
      },
      next: {
        revalidate: 86400,
      },
    });

    if (!res.ok) {
      throw new Error(`Metrics API failed: ${res.status}`);
    }

    const data = await res.json();

    return data?.totalCount ?? 0;
  } catch (err) {
    console.error("Web playthroughs error:", err);

    return 0;
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
    console.error("Analytics error:", err);
    return [];
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
      console.error("Articles fetch error:", err);
      return { articles: { data: [] } };
    }
  },
  ["all-articles"],
  { revalidate: revalidateTime },
);

async function fetchDashboardData(range: DashboardDateRange) {
  try {
    const [
      instagram,
      seedPlanted,
      analyticsPageVisits,
      webPlaythroughs,
      articlesData,
    ] = await Promise.all([
      getInstagramData(range),
      getSeedPlanted(),
      getAnalyticsPageVisits(range),
      getWebPlaythroughs(),
      getAllArticlesCached(),
    ]);

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
      analyticsPageVisits,
      mostViewedArticle,
    };
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return {
      instagram: { followersCount: 0, mostViewedPost: null },
      game: {
        seedPlanted: { count: 0, users: 0, sessions: 0 },
        webPlaythroughs: 0,
      },
      analyticsPageVisits: [],
      mostViewedArticle: null,
    };
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

  return unstable_cache(
    () =>
      fetchDashboardData({
        startDate: actualStartDate,
        endDate: actualEndDate,
      }),
    ["dashboard-data", actualStartDate, actualEndDate],
    {
      revalidate: revalidateTime,
    },
  )();
}
