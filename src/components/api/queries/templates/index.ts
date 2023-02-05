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

export { getAllPublicTemplatesQuery };
