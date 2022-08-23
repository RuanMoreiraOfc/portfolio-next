import { gql } from '@apollo/client';

export { getReadme };
export type { GetReadmeInput, GetReadmeResponse };

const getReadme = gql`
  query GET_README(
    $name: String!
    $readmeObjectName: String = "HEAD:README.md"
  ) {
    repo: repository(owner: "ruanmoreiraofc", name: $name) {
      url
      defaultBranchRef {
        name
      }
      readme: object(expression: $readmeObjectName) {
        ... on Blob {
          text
        }
      }
    }
  }
`;

type GetReadmeInput = {
  name: string;
  readmeObjectName?: null | 'HEAD:README.md' | 'HEAD:README_PORTUGUESE.md';
};

type GetReadmeResponse = {
  repo: {
    url: string;
    defaultBranchRef: {
      name: string;
    };
    readme: null | {
      text: string;
    };
  };
};
