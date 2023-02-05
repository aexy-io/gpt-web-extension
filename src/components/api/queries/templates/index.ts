// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { GraphQLClient } = require("graphql-hooks");

import { GraphQLClient } from "graphql-hooks";

const getAllPublicTemplatesQuery = `
query GetAllPublicTemplates {
    templates(condition: { public: true }) {
      nodes {
        id
        name
        metadata
        public
        tags
        updatedAt
        websites
        createdAt
        userByUid {
          id
          username
          name
        }
      }
    }
  }
`;

const getAllPublicTemplates = async (client: GraphQLClient) => {
    const res = await client.request({
        query: getAllPublicTemplatesQuery,
    });

    // res?.data?.
    return res;
};

export { getAllPublicTemplatesQuery, getAllPublicTemplates };
