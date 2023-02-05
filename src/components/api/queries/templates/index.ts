// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { GraphQLClient } = require("graphql-hooks");

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

// export const getAllPublicTemplates = async (client: GraphQLClient) => {
//     const res = await client.request({
//         query: getAllPublicTemplatesQuery,
//     });

//     // res?.data?.
//     return res;
// };

// module.exports = {
//     getAllPublicTemplates,
// };

export { getAllPublicTemplatesQuery };
