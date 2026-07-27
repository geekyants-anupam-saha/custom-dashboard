import { gql } from "@apollo/client";

export const getArticleData = gql`
  query getAllArticles(
    $page: Int
    $pageSize: Int
    $locale: I18NLocaleCode
    $sort: [String] = ["PublishDate:desc"]
    $filters: ArticleFiltersInput
  ) {
    articles(
      pagination: { page: $page, pageSize: $pageSize }
      locale: $locale
      sort: $sort
      filters: $filters
    ) {
      data {
        id
        attributes {
          Title
          Slug
          ShortDes
          CoverImg {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;
