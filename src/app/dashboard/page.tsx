import DashboardPage from "./DashboardClient";
import { getArticleData } from "@/services";
import { fetchData } from "@/services/fetchData";

export default async function HomePage() {
  const data: any | null = await fetchData(getArticleData, {
    locale: "en",
  });

  const dashboardRes = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
  });

  const dashboard = await dashboardRes.json();

  const articles = data?.articles?.data ?? [];

  const analyticsPages = dashboard?.analyticsPageVisits ?? [];

  const mostViewedArticles = articles
    .map((article: any) => {
      const slug = article.attributes.Slug;

      const analyticsData = analyticsPages.find((page: any) => {
        const pageSlug = page.pagePath.split("/").filter(Boolean).pop();

        return pageSlug?.toLowerCase() === slug?.toLowerCase();
      });

      if (!analyticsData) return null;

      return {
        ...article,
        pageViews: analyticsData.pageViews,
        averageSessionDuration: analyticsData.averageEngagementPerActiveUser,
        pagePath: analyticsData.pagePath,
        pageTitle: analyticsData.pageTitle,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.pageViews - a.pageViews);

  return (
    <DashboardPage
      dashboardData={dashboard}
      mostViewedArticle={mostViewedArticles[0] ?? null}
    />
  );
}
