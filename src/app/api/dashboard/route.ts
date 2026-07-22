import { NextResponse } from "next/server";

const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN!;
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID!;

const METRICS_API =
  "https://admin.game.worldofus.info/api/metrics/query?fromUtc=2026-02-02T22%3A00%3A00.0000000Z&toUtc=2026-06-22T20%3A59%3A59.9999999Z&groupBy=metricKey&operation=sum&limit=500&metricGroups=planting";

const METRICS_TOKEN = process.env.METRICS_API_TOKEN!;

async function getInstagramData() {
  try {
    // Followers
    const accountRes = await fetch(
      `https://graph.facebook.com/v23.0/${INSTAGRAM_ACCOUNT_ID}?fields=followers_count&access_token=${FB_PAGE_ACCESS_TOKEN}`,
      {
        next: {
          revalidate: 3600,
        },
      },
    );

    const account = await accountRes.json();

    // Fetch all media pages
    let allPosts: any[] = [];

    let nextUrl: string | null =
      `https://graph.facebook.com/v23.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,media_url,thumbnail_url,media_type,permalink,timestamp,like_count,comments_count,insights.metric(views,saved)&limit=100&access_token=${FB_PAGE_ACCESS_TOKEN}`;

    while (nextUrl) {
      const res: any = await fetch(nextUrl, {
        next: {
          revalidate: 3600,
        },
      });

      const data = await res.json();

      allPosts.push(...(data.data ?? []));

      nextUrl = data.paging?.next ?? null;
    }

    const posts = allPosts.map((item: any) => ({
      id: item.id,
      caption: item.caption,
      mediaUrl: item.media_url,
      thumbnailUrl: item.thumbnail_url,
      image: item.media_url || item.thumbnail_url,
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
    console.error(err);

    return {
      followersCount: 0,
      mostViewedPost: null,
    };
  }
}
async function getSeedPlanted() {
  try {
    const res = await fetch(METRICS_API, {
      headers: {
        "X-Metrics-Api-Token": METRICS_TOKEN,
      },
      next: {
        revalidate: 3600,
      },
    });

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
    console.error(err);

    return {
      count: 0,
      users: 0,
      sessions: 0,
    };
  }
}

export async function GET() {
  const [instagram, seedPlanted] = await Promise.all([
    getInstagramData(),
    getSeedPlanted(),
  ]);

  return NextResponse.json({
    instagram,
    game: {
      seedPlanted,
      webPlaythroughs: null, // TODO
    },
    mostViewedArticle: null, // TODO
  });
}
