import { gql } from '@apollo/client';

export { getPortfolioRepos };
export type { GetPortfolioReposInput, GetPortfolioReposResponse };

const getPortfolioRepos = gql`
  query GET_PORTFOLIO_REPOS {
    profile: search(
      first: 100
      query: """
      ruanmoreiraofc/
      portfolio-project in:topic
      """
      type: REPOSITORY
    ) {
      repos: nodes {
        ... on Repository {
          visibility
          createdAt
          updatedAt
          name
          description
          url
          thumbnail: openGraphImageUrl
          hasThumbnail: usesCustomOpenGraphImage
          demoUrl: homepageUrl
          languages(first: 8) {
            list: nodes {
              name
              color
            }
          }
          repositoryTopics(first: 8) {
            list: nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

type GetPortfolioReposInput = {};

type GetPortfolioReposResponse = {
  profile: null | {
    repos: Array<{
      visibility: 'PUBLIC' | 'INTERNAL' | 'PRIVATE';
      createdAt: string;
      updatedAt: string;
      name: string;
      description: null | string;
      url: string;
      thumbnail: string;
      hasThumbnail: boolean;
      demoUrl: null | string;
      languages: {
        list: Array<{
          name: string;
          color: string;
        }>;
      };
      repositoryTopics: {
        list: Array<{
          topic: {
            name: string;
          };
        }>;
      };
    }>;
  };
};
