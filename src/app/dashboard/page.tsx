/* eslint-disable @typescript-eslint/no-explicit-any */
import { getArticleDataCached, getDashboardData } from "@/lib/dashboard/getDashboardData";
import DashboardPage from "./DashboardClient";

export default async function HomePage() {
  const articlesData: any = await getArticleDataCached();
  const dashboardData = await getDashboardData();

  const articles = articlesData?.articles?.data ?? [];

  const analyticsPages = dashboardData?.analyticsPageVisits ?? [];

  let mostViewedArticle = null;

  for (const page of analyticsPages) {
    const pageSlug = page.pagePath?.split("/").filter(Boolean).pop();

    const articleData = articles.find((article: any) => {
      const slug = article.attributes.Slug;

      return pageSlug?.toLowerCase() === slug?.toLowerCase();
    });

    if (articleData) {
      mostViewedArticle = {
        ...articleData,
        pageViews: page.pageViews,
        averageSessionDuration: page.averageEngagementPerActiveUser,
        pagePath: page.pagePath,
        pageTitle: page.pageTitle,
      };

      break;
    }
  }

  return (
    <DashboardPage
      dashboardData={dashboardData}
      mostViewedArticle={mostViewedArticle ?? null}
    />
  );
}