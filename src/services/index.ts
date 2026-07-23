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
      meta {
        pagination {
          total
          page
          pageCount
        }
      }
      data {
        id
        attributes {
          readTime
          ExcludeFromSlider
          Title
          Slug
          ShortDes
          CoverImg {
            data {
              attributes {
                url
                alternativeText
                caption
              }
            }
          }
          PublishDate
          Video
          VideoLink
          LikeCount
          article_categories {
            data {
              attributes {
                Name
              }
            }
          }
          authors {
            data {
              attributes {
                Name
                ProfilePic {
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
      }
    }
  }
`;
