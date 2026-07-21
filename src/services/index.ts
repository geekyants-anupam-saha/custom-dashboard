import { gql } from "@apollo/client";

export const getArticleBySlug = gql`
  query getArticleBySlug($slug: String!, $locale: I18NLocaleCode) {
    articles(locale: $locale, filters: { Slug: { eq: $slug } }) {
      data {
        id
        attributes {
          Title
          Slug
          Description

          CoverImg {
            data {
              attributes {
                url
                alternativeText
                caption
              }
            }
          }
        }
      }
    }
  }
`;
